import { Injectable } from "@nestjs/common";
import Optimus from "optimus-js";

export function optimusEncode(uuid) {
    try {
        var optimus = new Optimus(1575116329, 1652301337, 54600640);       
         var hash = optimus.encode(uuid);
        return hash
    } catch (error) {
        return error;
    }
}

export function optimusDecode(id) {
    try {
        var optimus = new Optimus(1575116329, 1652301337, 54600640);       
         var hash = optimus.decode(id);
        return hash
    } catch (error) {
        return error;
    }
}