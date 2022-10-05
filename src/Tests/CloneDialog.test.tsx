import React from "react";
import {render} from "@testing-library/react";
import { CloneDialog } from "../CloneDialog/CloneDialog";

describe("clonedialog", () => {
    test("clonedialog - initial test", async () => {
      console.log("First test of unit testing");
      //expect(0).toBe(1);
      render(<CloneDialog />);
    });
  });