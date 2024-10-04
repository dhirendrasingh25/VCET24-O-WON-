import React from "react";
import { Button } from "../ui/button";

const Navbar = () => {
    return (
        <div className="px-10 py-4 sticky top-0 flex flex-row items-center  justify-between">
            <div className="mx-2 sm:mx-4">Logo</div>
            <div className="sm:flex flex-row w-full justify-end hidden space-x-6  mr-10">
                {["Home", "Take a Quiz", "Testimonials", "About Us"].map(
                    (item, idx) => (
                        <div key={idx}>{item}</div>
                    ),
                )}
            </div>
            <div>
                <Button className="px-6">Login</Button>
            </div>
        </div>
    );
};

export default Navbar;
