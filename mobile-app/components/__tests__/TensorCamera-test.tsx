import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TensorCamera from "../TensorCamera";
import { CameraView, useCameraPermissions } from "expo-camera"; // Mock the expo-camera imports

jest.mock("expo-camera", () => ({
  CameraView: jest.fn().mockReturnValue(null), // Mock CameraView as a simple component
  useCameraPermissions: jest.fn(), // Mock useCameraPermissions hook
}));

describe("TensorCamera Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state when permissions are undefined", () => {
    // Mock useCameraPermissions to return undefined (loading state)
    (useCameraPermissions as jest.Mock).mockReturnValue([undefined, jest.fn()]);

    const { queryByText, queryByTestId } = render(<TensorCamera />);

    // Expect no camera to be shown (empty View is rendered)
    expect(queryByTestId("camera-view")).toBeNull();
    // No permission-related messages are shown yet
    expect(
      queryByText("We need your permission to show the camera"),
    ).toBeNull();
  });

  test("renders permission request message when camera permission is not granted", () => {
    // Mock useCameraPermissions to return ungranted permission
    const mockRequestPermission = jest.fn();
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: false },
      mockRequestPermission,
    ]);

    const { getByText } = render(<TensorCamera />);

    // Expect permission request message to be displayed
    expect(
      getByText("We need your permission to show the camera"),
    ).toBeTruthy();

    // Press the "grant permission" button
    fireEvent.press(getByText("grant permission"));
    expect(mockRequestPermission).toHaveBeenCalled();
  });

  test("toggles camera facing mode when 'Flip Camera' is pressed", () => {
    // Mock useCameraPermissions to return granted permission
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: true },
      jest.fn(),
    ]);

    const { getByText } = render(<TensorCamera />);

    const flipButton = getByText("Flip Camera");

    // Initial facing mode should be 'back'
    expect(CameraView).toHaveBeenCalledWith(
      expect.objectContaining({ facing: "back" }),
      {},
    );

    // Press the "Flip Camera" button
    fireEvent.press(flipButton);

    // After toggling, the facing mode should be 'front'
    expect(CameraView).toHaveBeenCalledWith(
      expect.objectContaining({ facing: "front" }),
      {},
    );
  });
});
