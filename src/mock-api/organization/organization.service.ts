import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationApiService {

    async getAllOrganization() {
        return {
            "link": [
                {
                    "relation": "next",
                    "url": "https://dev-integration.bots.docsink.com/api/mock-api/fhir/Organization?_count=100"
                }
            ],
            "entry": [
                {
                    "resource": {
                        "resourceType": "Organization",
                        "id": "LO-1935217709431770",
                        "text": {
                            "status": "generated",
                            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table width=\"100%\"><tbody><tr><td width=\"25%\">FCT - Intake</td><td width=\"42%\">615 Shipyard Blvd Wilmington, NC 28412 Phone: 9103430145 Fax: 9103415779</td></tr></tbody></table></div>"
                        },
                        "identifier": [
                            {
                                "type": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v2/0203",
                                            "code": "XX",
                                            "display": "Organization Id"
                                        }
                                    ],
                                    "text": "Organization Id"
                                },
                                "system": "http://www.gehealthcare.com/fhir/cpsemr/namingsystem/ORGANIZATION/38707-44224-15155",
                                "value": "LO-1935217709431770"
                            },
                            {
                                "type": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v2/0203",
                                            "code": "TAX",
                                            "display": "Tax ID number"
                                        }
                                    ],
                                    "text": "Tax ID number"
                                },
                                "system": "urn:oid:2.16.840.1.113883.4.2",
                                "value": "560950370"
                            }
                        ],
                        "active": true,
                        "type": {
                            "coding": [
                                {
                                    "system": "urn:oid:1.3.6.1.4.1.19376.1.5.3.3",
                                    "code": "EMPLOYER",
                                    "display": " Employer"
                                }
                            ],
                            "text": " Employer"
                        },
                        "name": "FCT - Intake",
                        "telecom": [
                            {
                                "system": "phone",
                                "value": "9103430145",
                                "use": "work"
                            },
                            {
                                "system": "fax",
                                "value": "9103415779"
                            }
                        ],
                        "address": [
                            {
                                "line": [
                                    "615 Shipyard Blvd"
                                ],
                                "city": "Wilmington",
                                "state": "NC",
                                "postalCode": "28412"
                            }
                        ]
                    }
                }
            ]
        }
    };

    async getNextOrganization(){
        return {
            "link": [
                {
                    "relation": "self",
                    "url": "https://dev-integration.bots.docsink.com/api/mock-api/fhir/Organization?_count=10"
                }
            ],
            "entry": [
                {
                    "resource": {
                        "resourceType": "Organization",
                        "id": "LO-1935217709431771",
                        "text": {
                            "status": "generated",
                            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table width=\"100%\"><tbody><tr><td width=\"25%\">FCT - Intake</td><td width=\"42%\">615 Shipyard Blvd Wilmington, NC 28412 Phone: 9103430145 Fax: 9103415779</td></tr></tbody></table></div>"
                        },
                        "identifier": [
                            {
                                "type": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v2/0203",
                                            "code": "XX",
                                            "display": "Organization Id"
                                        }
                                    ],
                                    "text": "Organization Id"
                                },
                                "system": "http://www.gehealthcare.com/fhir/cpsemr/namingsystem/ORGANIZATION/38707-44224-15155",
                                "value": "LO-1935217709431770"
                            },
                            {
                                "type": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v2/0203",
                                            "code": "TAX",
                                            "display": "Tax ID number"
                                        }
                                    ],
                                    "text": "Tax ID number"
                                },
                                "system": "urn:oid:2.16.840.1.113883.4.2",
                                "value": "560950370"
                            }
                        ],
                        "active": true,
                        "type": {
                            "coding": [
                                {
                                    "system": "urn:oid:1.3.6.1.4.1.19376.1.5.3.3",
                                    "code": "EMPLOYER",
                                    "display": " Employer"
                                }
                            ],
                            "text": " Employer"
                        },
                        "name": "FCT - Intake Test",
                        "telecom": [
                            {
                                "system": "phone",
                                "value": "9103430146",
                                "use": "work"
                            },
                            {
                                "system": "fax",
                                "value": "9103415776"
                            }
                        ],
                        "address": [
                            {
                                "line": [
                                    "615 Shipyard Blvd Testing"
                                ],
                                "city": "Wilmington",
                                "state": "NC",
                                "postalCode": "28413"
                            }
                        ]
                    }
                }
            ]
        }
    }

}
