

export async function mydatalocationDataFormat(payload,botConfig) {

    try {
        let data = {
            id :botConfig?.mydataLocationId,
            location_id: payload.id,
            name: payload.name,
            address: payload?.address?.line[0],
            city: payload?.address.city,
            state: payload?.address.state,
            phone: payload.telecom,
            status: payload?.status,
            partof: payload?.partOf.reference,
            postalCode: payload?.address.postalCode,
            mydata_configuration: botConfig.mydata_configuration,
            content: payload
        }
        return data;

    } catch (error) {
        this._getBadRequestError(error.message);
    }

}


export async function docsinkOrgLocationFormat(payload) {
    try {

        let data = {
            loc_name: payload?.name,
            nickname: payload?.name,
            status: 'Y',
            default_loc: "Y",
            type: "practice",

        }
        if (payload?.status && payload?.status == 'active') {
            data['active'] = true;
        }
        else {
            data['active'] = false;
        }
        
        return data;

    } catch (error) {
        this._getBadRequestError(error.message);
    }
}


export async function docsinkLocationFormat(payload, docsink_organization) {
    try {

        let data =
        {
            is_active: payload?.active ? payload?.active : true,
            is_default_location: payload.default_loc == 'Y' ? true : false,
            name: payload?.loc_name,
            nickname: payload?.nickname,
            type: payload?.type,
            uuid: payload?.uuid,
            docsink_organization: docsink_organization,
            status:payload?.status
            
        }
        return data;

    } catch (error) {
        this._getBadRequestError(error.message);

    }
}

export async function docsinkOfficeFormat(payload, docsink_organization) {
    try {

        let data =
        {
            is_active: payload?.active ? payload?.active : null,
            name: payload?.name,
            uuid: payload?.uuid,
            docsink_organization: docsink_organization            
        }
        return data;

    } catch (error) {
        this._getBadRequestError(error.message);

    }
}

