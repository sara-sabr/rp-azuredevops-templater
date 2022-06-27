import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, getClient, IHostPageLayoutService } from "azure-devops-extension-api";
import { BuildDefinition, BuildRestClient } from "azure-devops-extension-api/Build";
import * as React from "react";
import { Button } from "azure-devops-ui/Button";
import { Panel } from "azure-devops-ui/Panel";

SDK.register("Context-Clone-Panel", () => {
    var callbacks:any[] = [];
                
                function inputChanged() {
                    // Execute registered callbacks
                    for(var i = 0; i < callbacks.length; i++) {
                        callbacks[i](isValid());
                    }
                }
                
                function isValid() {
                    // Check whether form is valid or not
                    return true;
                }
                
                function getFormData() {
                    // Get form values
                    return {
                        name: "",
                        dateOfBirth: "",
                        email: ""
                    };
                }

                return {
                    isFormValid: function() {
                        return isValid();   
                    },
                    getFormData: function() {
                        return getFormData();
                    },
                    attachFormChanged: function(cb:any) {
                         callbacks.push(cb);
                    }
                };
});

SDK.init();