import seed from "../../tasks/seed.js";
import clean from "../../tasks/clean.js";
import axios from 'axios';

import {expect, jest, test} from '@jest/globals';

import {wrapper} from "axios-cookiejar-support";
import {CookieJar} from "tough-cookie";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

let loggedIn;

beforeAll(async () => {
    await clean();
    await seed();
});

beforeEach(async () => {
    loggedIn = (await client.post('http://localhost:3000/login',
                                  {
                                      phoneNumber: "1-800-999-9999",
                                      password: "SamplePassWord12345+",
                                  },
                                  {withCredentials: true}
    )).data;
});

test("Unauthenticated Test", async () => {

    await client.get('http://localhost:3000/logout', {withCredentials: true});

    try {
        await client.get('http://localhost:3000/meals/report', {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }
});

test("Get Test", async () => {
    let report = (await client.get('http://localhost:3000/meals/report', {withCredentials: true})).data;

    let expected = {
        "pastDay": {
            "calories": {
                "count": 2,
                "total": 553,
                "avg": 276.5,
                "max": 492,
                "min": 61
            },
            "carbohydrates": {
                "sugars": {
                    "count": 2,
                    "total": 32.9,
                    "avg": 16.45,
                    "max": 24,
                    "min": 8.9
                },
                "fiber": {
                    "count": 2,
                    "total": 5.4,
                    "avg": 2.7,
                    "max": 3,
                    "min": 2.4
                }
            },
            "protein": {
                "total": {
                    "count": 2,
                    "total": 2.2,
                    "avg": 1.1,
                    "max": 1.1,
                    "min": 1.1
                }
            },
            "fats": {
                "Saturated": {
                    "count": 2,
                    "total": 2,
                    "avg": 1,
                    "max": 1,
                    "min": 1
                },
                "Monounsaturated": {
                    "count": 2,
                    "total": 2.4,
                    "avg": 1.2,
                    "max": 1.2,
                    "min": 1.2
                },
                "Polyunsaturated": {
                    "count": 2,
                    "total": 1.6,
                    "avg": 0.8,
                    "max": 0.8,
                    "min": 0.8
                },
                "Trans": {
                    "count": 2,
     "total": 0,
     "avg": 0,
     "max": 0,
     "min": 0
                }
            },
            "minerals": {
                "vitaminA": {
                    "count": 1,
     "total": 0.000048,
     "avg": 0.000048,
     "max": 0.000048,
     "min": 0.000048
                },
     "vitaminE": {
         "count": 1,
     "total": 0.001,
     "avg": 0.001,
     "max": 0.001,
     "min": 0.001
     },
     "sodium": {
         "count": 1,
     "total": 0.361,
     "avg": 0.361,
     "max": 0.361,
     "min": 0.361
     },
     "potassium": {
         "count": 1,
     "total": 0.123,
     "avg": 0.123,
     "max": 0.123,
     "min": 0.123
     },
     "calcium": {
         "count": 1,
     "total": 0.056,
     "avg": 0.056,
     "max": 0.056,
     "min": 0.056
     },
     "iron": {
         "count": 1,
     "total": 0.003,
     "avg": 0.003,
     "max": 0.003,
     "min": 0.003
     }
            },
            "other": {
                "vitaminC": {
                    "count": 1,
     "total": 0.0927,
     "avg": 0.0927,
     "max": 0.0927,
     "min": 0.0927
                },
     "vitaminK": {
         "count": 1,
     "total": 0.0000403,
     "avg": 0.0000403,
     "max": 0.0000403,
     "min": 0.0000403
     },
     "vitaminE": {
         "count": 1,
     "total": 0.0015,
     "avg": 0.0015,
     "max": 0.0015,
     "min": 0.0015
     },
     "potassium": {
         "count": 1,
     "total": 0.312,
     "avg": 0.312,
     "max": 0.312,
     "min": 0.312
     },
     "calcium": {
         "count": 1,
     "total": 0.034,
     "avg": 0.034,
     "max": 0.034,
     "min": 0.034
     },
     "magnesium": {
         "count": 1,
     "total": 0.017,
     "avg": 0.017,
     "max": 0.017,
     "min": 0.017
     }
            }
        },
        "pastWeek": {
            "calories": {
                "count": 2,
     "total": 553,
     "avg": 276.5,
     "max": 492,
     "min": 61
            },
     "carbohydrates": {
         "sugars": {
             "count": 2,
     "total": 32.9,
     "avg": 16.45,
     "max": 24,
     "min": 8.9
         },
     "fiber": {
         "count": 2,
     "total": 5.4,
     "avg": 2.7,
     "max": 3,
     "min": 2.4
     }
     },
     "protein": {
         "total": {
             "count": 2,
     "total": 2.2,
     "avg": 1.1,
     "max": 1.1,
     "min": 1.1
         }
     },
     "fats": {
         "Saturated": {
             "count": 2,
     "total": 2,
     "avg": 1,
     "max": 1,
     "min": 1
         },
     "Monounsaturated": {
         "count": 2,
     "total": 2.4,
     "avg": 1.2,
     "max": 1.2,
     "min": 1.2
     },
     "Polyunsaturated": {
         "count": 2,
     "total": 1.6,
     "avg": 0.8,
     "max": 0.8,
     "min": 0.8
     },
     "Trans": {
         "count": 2,
     "total": 0,
     "avg": 0,
     "max": 0,
     "min": 0
     }
     },
     "minerals": {
         "vitaminA": {
             "count": 1,
     "total": 0.000048,
     "avg": 0.000048,
     "max": 0.000048,
     "min": 0.000048
         },
     "vitaminE": {
         "count": 1,
     "total": 0.001,
     "avg": 0.001,
     "max": 0.001,
     "min": 0.001
     },
     "sodium": {
         "count": 1,
     "total": 0.361,
     "avg": 0.361,
     "max": 0.361,
     "min": 0.361
     },
     "potassium": {
         "count": 1,
     "total": 0.123,
     "avg": 0.123,
     "max": 0.123,
     "min": 0.123
     },
     "calcium": {
         "count": 1,
     "total": 0.056,
     "avg": 0.056,
     "max": 0.056,
     "min": 0.056
     },
     "iron": {
         "count": 1,
     "total": 0.003,
     "avg": 0.003,
     "max": 0.003,
     "min": 0.003
     }
     },
     "other": {
         "vitaminC": {
             "count": 1,
     "total": 0.0927,
     "avg": 0.0927,
     "max": 0.0927,
     "min": 0.0927
         },
     "vitaminK": {
         "count": 1,
     "total": 0.0000403,
     "avg": 0.0000403,
     "max": 0.0000403,
     "min": 0.0000403
     },
     "vitaminE": {
         "count": 1,
     "total": 0.0015,
     "avg": 0.0015,
     "max": 0.0015,
     "min": 0.0015
     },
     "potassium": {
         "count": 1,
     "total": 0.312,
     "avg": 0.312,
     "max": 0.312,
     "min": 0.312
     },
     "calcium": {
         "count": 1,
     "total": 0.034,
     "avg": 0.034,
     "max": 0.034,
     "min": 0.034
     },
     "magnesium": {
         "count": 1,
     "total": 0.017,
     "avg": 0.017,
     "max": 0.017,
     "min": 0.017
     }
     }
        },
        "pastMonth": {
            "calories": {
                "count": 2,
     "total": 553,
     "avg": 276.5,
     "max": 492,
     "min": 61
            },
     "carbohydrates": {
         "sugars": {
             "count": 2,
     "total": 32.9,
     "avg": 16.45,
     "max": 24,
     "min": 8.9
         },
     "fiber": {
         "count": 2,
     "total": 5.4,
     "avg": 2.7,
     "max": 3,
     "min": 2.4
     }
     },
     "protein": {
         "total": {
             "count": 2,
     "total": 2.2,
     "avg": 1.1,
     "max": 1.1,
     "min": 1.1
         }
     },
     "fats": {
         "Saturated": {
             "count": 2,
     "total": 2,
     "avg": 1,
     "max": 1,
     "min": 1
         },
     "Monounsaturated": {
         "count": 2,
     "total": 2.4,
     "avg": 1.2,
     "max": 1.2,
     "min": 1.2
     },
     "Polyunsaturated": {
         "count": 2,
     "total": 1.6,
     "avg": 0.8,
     "max": 0.8,
     "min": 0.8
     },
     "Trans": {
         "count": 2,
     "total": 0,
     "avg": 0,
     "max": 0,
     "min": 0
     }
     },
     "minerals": {
         "vitaminA": {
             "count": 1,
             "total": 0.000048,
             "avg": 0.000048,
             "max": 0.000048,
             "min": 0.000048
         },
         "vitaminE": {
             "count": 1,
             "total": 0.001,
             "avg": 0.001,
             "max": 0.001,
             "min": 0.001
         },
         "sodium": {
             "count": 1,
             "total": 0.361,
             "avg": 0.361,
             "max": 0.361,
             "min": 0.361
         },
         "potassium": {
             "count": 1,
             "total": 0.123,
             "avg": 0.123,
             "max": 0.123,
             "min": 0.123
         },
         "calcium": {
             "count": 1,
             "total": 0.056,
             "avg": 0.056,
             "max": 0.056,
             "min": 0.056
         },
         "iron": {
             "count": 1,
             "total": 0.003,
             "avg": 0.003,
             "max": 0.003,
             "min": 0.003
         }
     },
     "other": {
         "vitaminC": {
             "count": 1,
             "total": 0.0927,
             "avg": 0.0927,
             "max": 0.0927,
             "min": 0.0927
         },
         "vitaminK": {
             "count": 1,
             "total": 0.0000403,
             "avg": 0.0000403,
             "max": 0.0000403,
             "min": 0.0000403
         },
         "vitaminE": {
             "count": 1,
             "total": 0.0015,
             "avg": 0.0015,
             "max": 0.0015,
             "min": 0.0015
         },
         "potassium": {
             "count": 1,
             "total": 0.312,
             "avg": 0.312,
             "max": 0.312,
             "min": 0.312
         },
         "calcium": {
             "count": 1,
             "total": 0.034,
             "avg": 0.034,
             "max": 0.034,
             "min": 0.034
         },
         "magnesium": {
             "count": 1,
             "total": 0.017,
             "avg": 0.017,
             "max": 0.017,
             "min": 0.017
         }
     }
        },
        "pastYear": {
            "calories": {
                "count": 2,
                "total": 553,
                "avg": 276.5,
                "max": 492,
                "min": 61
            },
            "carbohydrates": {
                "sugars": {
                    "count": 2,
                    "total": 32.9,
                    "avg": 16.45,
                    "max": 24,
                    "min": 8.9
                },
                "fiber": {
                    "count": 2,
                    "total": 5.4,
                    "avg": 2.7,
                    "max": 3,
                    "min": 2.4
                }
            },
            "protein": {
                "total": {
                    "count": 2,
                    "total": 2.2,
                    "avg": 1.1,
                    "max": 1.1,
                    "min": 1.1
                }
            },
            "fats": {
                "Saturated": {
                    "count": 2,
                    "total": 2,
                    "avg": 1,
                    "max": 1,
                    "min": 1
                },
                "Monounsaturated": {
                    "count": 2,
                    "total": 2.4,
                    "avg": 1.2,
                    "max": 1.2,
                    "min": 1.2
                },
                "Polyunsaturated": {
                    "count": 2,
                    "total": 1.6,
                    "avg": 0.8,
                    "max": 0.8,
                    "min": 0.8
                },
                "Trans": {
                    "count": 2,
                    "total": 0,
                    "avg": 0,
                    "max": 0,
                    "min": 0
                }
            },
            "minerals": {
                "vitaminA": {
                    "count": 1,
                    "total": 0.000048,
                    "avg": 0.000048,
                    "max": 0.000048,
                    "min": 0.000048
                },
                "vitaminE": {
                    "count": 1,
                    "total": 0.001,
                    "avg": 0.001,
                    "max": 0.001,
                    "min": 0.001
                },
                "sodium": {
                    "count": 1,
                    "total": 0.361,
                    "avg": 0.361,
                    "max": 0.361,
                    "min": 0.361
                },
                "potassium": {
                    "count": 1,
                    "total": 0.123,
                    "avg": 0.123,
                    "max": 0.123,
                    "min": 0.123
                },
                "calcium": {
                    "count": 1,
                    "total": 0.056,
                    "avg": 0.056,
                    "max": 0.056,
                    "min": 0.056
                },
                "iron": {
                    "count": 1,
                    "total": 0.003,
                    "avg": 0.003,
                    "max": 0.003,
                    "min": 0.003
                }
            },
            "other": {
                "vitaminC": {
                    "count": 1,
                    "total": 0.0927,
                    "avg": 0.0927,
                    "max": 0.0927,
                    "min": 0.0927
                },
                "vitaminK": {
                    "count": 1,
                    "total": 0.0000403,
                    "avg": 0.0000403,
                    "max": 0.0000403,
                    "min": 0.0000403
                },
                "vitaminE": {
                    "count": 1,
                    "total": 0.0015,
                    "avg": 0.0015,
                    "max": 0.0015,
                    "min": 0.0015
                },
                "potassium": {
                    "count": 1,
                    "total": 0.312,
                    "avg": 0.312,
                    "max": 0.312,
                    "min": 0.312
                },
                "calcium": {
                    "count": 1,
                    "total": 0.034,
                    "avg": 0.034,
                    "max": 0.034,
                    "min": 0.034
                },
                "magnesium": {
                    "count": 1,
                    "total": 0.017,
                    "avg": 0.017,
                    "max": 0.017,
                    "min": 0.017
                }
            }
        },
        "lifetime": {
            "calories": {
                "count": 2,
                "total": 553,
                "avg": 276.5,
                "max": 492,
                "min": 61
            },
            "carbohydrates": {
                "sugars": {
                    "count": 2,
                    "total": 32.9,
                    "avg": 16.45,
                    "max": 24,
                    "min": 8.9
                },
                "fiber": {
                    "count": 2,
                    "total": 5.4,
                    "avg": 2.7,
                    "max": 3,
                    "min": 2.4
                }
            },
            "protein": {
                "total": {
                    "count": 2,
                    "total": 2.2,
                    "avg": 1.1,
                    "max": 1.1,
                    "min": 1.1
                }
            },
            "fats": {
                "Saturated": {
                    "count": 2,
                    "total": 2,
                    "avg": 1,
                    "max": 1,
                    "min": 1
                },
                "Monounsaturated": {
                    "count": 2,
                    "total": 2.4,
                    "avg": 1.2,
                    "max": 1.2,
                    "min": 1.2
                },
                "Polyunsaturated": {
                    "count": 2,
                    "total": 1.6,
                    "avg": 0.8,
                    "max": 0.8,
                    "min": 0.8
                },
                "Trans": {
                    "count": 2,
                    "total": 0,
                    "avg": 0,
                    "max": 0,
                    "min": 0
                }
            },
            "minerals": {
                "vitaminA": {
                    "count": 1,
                    "total": 0.000048,
                    "avg": 0.000048,
                    "max": 0.000048,
                    "min": 0.000048
                },
                "vitaminE": {
                    "count": 1,
                    "total": 0.001,
                    "avg": 0.001,
                    "max": 0.001,
                    "min": 0.001
                },
                "sodium": {
                    "count": 1,
                    "total": 0.361,
                    "avg": 0.361,
                    "max": 0.361,
                    "min": 0.361
                },
                "potassium": {
                    "count": 1,
                    "total": 0.123,
                    "avg": 0.123,
                    "max": 0.123,
                    "min": 0.123
                },
                "calcium": {
                    "count": 1,
                    "total": 0.056,
                    "avg": 0.056,
                    "max": 0.056,
                    "min": 0.056
                },
                "iron": {
                    "count": 1,
                    "total": 0.003,
                    "avg": 0.003,
                    "max": 0.003,
                    "min": 0.003
                }
            },
            "other": {
                "vitaminC": {
                    "count": 1,
                    "total": 0.0927,
                    "avg": 0.0927,
                    "max": 0.0927,
                    "min": 0.0927
                },
                "vitaminK": {
                    "count": 1,
                    "total": 0.0000403,
                    "avg": 0.0000403,
                    "max": 0.0000403,
                    "min": 0.0000403
                },
                "vitaminE": {
                    "count": 1,
                    "total": 0.0015,
                    "avg": 0.0015,
                    "max": 0.0015,
                    "min": 0.0015
                },
                "potassium": {
                    "count": 1,
                    "total": 0.312,
                    "avg": 0.312,
                    "max": 0.312,
                    "min": 0.312
                },
                "calcium": {
                    "count": 1,
                    "total": 0.034,
                    "avg": 0.034,
                    "max": 0.034,
                    "min": 0.034
                },
                "magnesium": {
                    "count": 1,
                    "total": 0.017,
                    "avg": 0.017,
                    "max": 0.017,
                    "min": 0.017
                }
            }
        }
    };

    expect(report).toMatchObject(expected);

}, 30000);
