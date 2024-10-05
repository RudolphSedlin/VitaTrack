// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is
import {events} from './config/mongoCollections.js';
import {ObjectId} from 'mongodb';

export const testEmailPart = (part) => {
    for (let subPart of part.split("."))
        for (let subSubPart of subPart.split("-"))
            for (let subSubSubPart of subSubPart.split("_"))
                if (subSubSubPart == "")
                    throw "Email prefix characters like '-_.' must be followed by a number or letter.";
}

export const testEmail = (contactEmail) => {
  let contactEmailFields = contactEmail.split("@");
  if (contactEmailFields.length !== 2)
    throw "Only one @ allowed in an email address.";

  if (contactEmailFields[0].length > 64)
    throw "Email prefix must be 64 characters or less.";
  testEmailPart(contactEmailFields[0]);

  for (let char of contactEmailFields[1])
    if (char == "_")
      throw "No underscores allowed in email domain.";
  testEmailPart(contactEmailFields[1]);
  contactEmailFields[1] = contactEmailFields[1].split(".");
  if (contactEmailFields[1].length == 1)
    throw "Email domain must have an extension.";
  if (contactEmailFields[1][0] == "")
    throw "Email domain can't just have an extension and nothing else.";
  if (contactEmailFields[1][contactEmailFields[1].length - 1].length < 2)
    throw "Email domain extension must be at least two characters.";
}

export const checkTime = (time) => {
    let fields = time.split(":");
    if (fields.length != 2)
        throw "Times must have one and only one colon.";
    if (fields[1].length != 5)
        throw "Time must obey an XX:YY AM or XX:YY PM format.";
    if (fields[1].slice(3, 5) !== "AM" && fields[1].slice(3, 5) !== "PM")
        throw "Time must either be an AM or PM time.";
    let outputTime = 0;
    if (fields[1].slice(3, 5) == "PM")
        outputTime += 720;

    let hour;
    let minute;
    if (isNaN(hour = Number(fields[0])) || hour < 1 || hour > 12)
        throw "Hour must be a number between 1 and 12.";
    if (isNaN(minute = Number(fields[1].slice(0, 2))) || minute < 0 || minute > 59)
        throw "Minute must be a number between 0 and 59.";
    outputTime += hour * 60 + minute;
    return outputTime;
}

export const checkID = (id) => {
    if (id == undefined)
        throw "Id not provided or undefined.";
    if (typeof id !== "string")
        throw "Id must be a string.";
    id = id.trim();
    if (id == "")
        throw "Id string cannot be empty or populated solely by spaces.";
    if (!ObjectId.isValid(id))
        throw "Invalid object id format.";
    return id;
}

export const getAll = async () => {
  let eventCollection = await events();
  let eventList = await eventCollection.find({}).toArray();
  for (let element of eventList)
    element._id = element._id.toString();
  return eventList;
};

export const get = async (id) => {
  id = checkID(id);
  let eventsCollection = await events();
  let event = await eventsCollection.findOne({_id: new ObjectId(id)});
  if (event === null)
    throw "No event with that id.";
  event._id = event._id.toString();
  return event;
};

export const remove = async (id) => {
  id = checkID(id);
  let eventsCollection = await events();
  let event = await eventsCollection.findOneAndDelete({_id: new ObjectId(id)});
  if (event === null)
    throw "No event with that id.";
  event._id = event._id.toString();
  return {eventName: event.eventName, deleted: true};
};

export const create = async (
  eventName,
  eventDescription,
  eventLocation,
  contactEmail,
  maxCapacity,
  priceOfAdmission,
  eventDate,
  startTime,
  endTime,
  publicEvent
) => {

  if (eventName == undefined || eventDescription == undefined || eventLocation == undefined || contactEmail == undefined || maxCapacity == undefined || priceOfAdmission == undefined || eventDate == undefined || startTime == undefined || endTime == undefined || publicEvent == undefined)
    throw 'All fields need to have valid and defined values.';

  if (typeof eventName !== "string" || typeof eventDescription !== "string" || typeof contactEmail !== "string" || typeof eventDate !== "string" || typeof startTime !== "string" || typeof endTime !== "string")
    throw "String type arguments are required for eventName, eventDescription, contactEmail, eventDate, startTime, and endTime.";

  eventName = eventName.trim();
  eventDescription = eventDescription.trim();
  contactEmail = contactEmail.trim();
  eventDate = eventDate.trim();
  startTime = startTime.trim();
  endTime = endTime.trim();

  if (eventName == "" || eventDescription == "" || contactEmail == "" || eventDate == "" || startTime == "" || endTime == "")
    throw "Strings with only spaces are not valid";

  if (eventName.length < 5)
    throw "Event name must be at least 5 characters long (excluding spaces)";
  if (eventDescription.length < 25)
    throw "Event description must be at least 25 characters long (excluding spaces)";

  testEmail(contactEmail);

  let dateFields = eventDate.split("/");

  let eventMonth = Number(dateFields[0]);
  if (isNaN(eventMonth))
    throw "Event month is not a number.";
  let eventDay = Number(dateFields[1]);
  if (isNaN(eventDay))
    throw "Event day is not a number.";
  let eventYear = Number(dateFields[2]);
  if (isNaN(eventYear))
    throw "Event year is not a number.";

  let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (eventMonth < 1 || eventMonth > 12)
    throw "Event month must be between 1 and 12.";
  if (eventDay < 1)
    throw "Event day must be at least 1.";
  if (eventDay > days[eventMonth - 1])
    throw "There are only " + days[eventMonth - 1] + " in " + months[eventMonth - 1] + ".";

  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth();
  let year = today.getFullYear();
  let epoch = 10000 * year + 100 * month + day;
  let eventEpoch = 10000 * eventYear + 100 * eventMonth + eventDay;

  if (eventEpoch <= epoch)
    throw "Event must be at a future date.";

  if (checkTime(endTime) < 30 + checkTime(startTime))
    throw "End time must be at least 30 minutes later than start time.";

  if (typeof publicEvent !== "boolean")
    throw "Public event must be a boolean.";

  if (typeof maxCapacity !== "number" || typeof priceOfAdmission !== "number")
    throw "Max capacity and price of admission must be numbers.";
  if (!Number.isInteger(maxCapacity))
    throw "Capacity must be an integer value!";
  if (maxCapacity < 1)
    throw "Max capacity must be a positive number.";
  let priceArr = String(priceOfAdmission).split(".");
  if (priceArr.length > 2 || (priceArr.length == 2 && priceArr[1].length !== 2) || (priceArr.length == 2 && Number(priceArr[0]) == 0))
    throw "Price must have either no decimals or two decimals only, and 0 must be written without decimals.";
  if (priceOfAdmission < 0)
    throw "Price of admission must be positive.";

  if (typeof eventLocation !== "object")
    throw "Event location must be an object with a streetAddress, city, state, and zip.";
  if (eventLocation.streetAddress == undefined || eventLocation.city == undefined || eventLocation.state == undefined || eventLocation.zip == undefined)
    throw "Event location is missing some fields such as street address, city, state, and zip.";
  if (typeof eventLocation.streetAddress !== "string" || typeof eventLocation.city !== "string" || typeof eventLocation.state !== "string" || typeof eventLocation.zip !== "string")
    throw "All fields for the event location must be strings.";

  eventLocation.streetAddress = eventLocation.streetAddress.trim();
  eventLocation.city = eventLocation.city.trim();
  eventLocation.state = eventLocation.state.trim();
  eventLocation.zip = eventLocation.zip.trim();

  if (eventLocation.streetAddress == "" || eventLocation.city == "" || eventLocation.state == "" || eventLocation.zip == "")
    throw "Fields for event location cannot just be empty or spaced strings.";

  if (eventLocation.streetAddress.length < 3)
    throw "Event location street address must be at least 3 non-space characters.";
  if (eventLocation.city.length < 3)
    throw "Event location city must be at least 3 non-space characters.";

  let states = ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];

  if (!states.includes(eventLocation.state))
    throw "Event location state must be a valid two letter state abbreviation such as NY or PA.";

  if (eventLocation.zip.length !== 5 || isNaN(Number(eventLocation.zip)))
    throw "Event location zip must be a 5 digit string.";

  let newEvent = {
    eventName: eventName,
    description: eventDescription,
    eventLocation: eventLocation,
    contactEmail: contactEmail,
    maxCapacity: maxCapacity,
    priceOfAdmission: priceOfAdmission,
    eventDate: eventDate,
    startTime: startTime,
    endTime: endTime,
    publicEvent: publicEvent
  };

  return newEvent
};
