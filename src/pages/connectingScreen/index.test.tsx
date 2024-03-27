import { render } from "@testing-library/react";
import ConnectingScreen from ".";

describe(ConnectingScreen, () => {
    it("Initially charger ID should be an empty string", () => {
        const { getByTestId } = render(<ConnectingScreen />);
        const companyName = getByTestId("companyName").textContent;
        expect(companyName).toBe("iPark");
    });
})