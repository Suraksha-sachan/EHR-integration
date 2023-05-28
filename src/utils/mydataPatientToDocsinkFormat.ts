export async function patientDataFormats(payload: any, botConfig: any) {
    try {

        let phone = null;
        let home_phone = null;
        let work_phone = null;
        let email = null;
        let language = null;
        let language_code = null;
        let security = null;

        if (payload.telecom && payload.telecom.length > 0) {

            phone = payload.telecom.filter((item) => {
                return item.use == "mobile";
            });
            home_phone = payload.telecom.filter((item) => {
                return item.use == "home"
            });
            work_phone = payload.telecom.filter((item) => {
                return item.use == "work"
            });

            email = payload.telecom.filter((item) => {
                return item.system == "email"
            });
        }

        if (payload.communication && payload.communication.length > 0) {
            language = payload.communication[0].language.text;
            if (payload.communication[0].language.coding && payload.communication[0].language.coding.length > 0) {
                language_code = payload.communication[0].language.coding[0].code;
            }
        }

        if (payload?.meta && payload.meta.security) {
            security = payload.meta.security[0].display;
        }

        let data =
        {
            id: botConfig?.mydata_patient_id,
            patient_id: payload?.id,
            phone: phone && phone.length > 0 ? phone[0].value : '',
            home_phone: home_phone && home_phone.length > 0 ? home_phone[0].value : '',
            work_phone: work_phone && work_phone.length > 0 ? work_phone[0].value : '',
            email: email && email.length > 0 ? email[0].value : '',
            preferred_phone_type: phone.length > 0 ? "Mobile" : home_phone.length > 0 ? "Home" : work_phone.length > 0 ? "Work" : null,
            mydata_configuration: botConfig?.mydata_configuration,
            address: payload?.address[0]?.line?.[0],
            city: payload?.address[0]?.city,
            state: payload?.address[0]?.state,
            postalCode: payload?.address[0]?.postalCode,
            first_name: payload?.name[0]?.given?.[0],
            last_name: payload?.name[0]?.family?.[0],
            content: payload,
            mydata_primary_practitioner: botConfig?.mydata_primary_practitioner,
            active: payload?.active,
            birthdate: payload?.birthDate,
            gender: payload?.gender,
            language: language,
            language_code: language_code,
            security: security
        }
        return data;

    } catch (error) {
        this._getBadRequestError(`Error in mydata patient to docsink format conversion:${error.message}`);

    }
}


export async function docsinkOrgPatientFormat(payload) {
    try {
        let data =
        {
            firstname: payload?.first_name,
            lastname: payload?.last_name,
            email: payload?.email,
            med_rec_no:payload?.patient_id,
            gender: payload?.gender == 'male' ? 'M' : 'F',
            phone_no: payload?.preferred_phone_type == 'Mobile' ? payload?.phone : payload?.preferred_phone_type == 'Home' ? payload.home_phone : payload?.work_phone,
            address: payload?.address,
            city: payload?.city,
            zip: payload?.postalCode,
            state: payload?.state,
            language: !payload?.code ? 'en' : payload?.language_code,
            do_not_sms: payload?.do_not_sms == false ? 0 : 1,
            do_not_contact: payload?.do_not_contact == false ? 0 : 1,
            active: payload?.sync_invalid_patient == true ? 0 : 1,
            dob: payload?.birthdate,
            phone_type: payload?.preferred_phone_type ? payload.preferred_phone_type :  payload?.mobile_phone ? 'Mobile' : payload?.home_phone ? 'Home' : payload?.work_phone ? 'Work' : null
        }
        return data;
    } catch (error) {
        this._getBadRequestError(`Error in mydata patient to docsinkorg format conversion:${error.message}`);


    }
}


export async function docsinkpatientFormat(payload, botConfig) {
    try {
        let data =
        {
            docsink_organization: botConfig?.docsink_organization,
            med_rec_no:payload?.med_rec_no,
            address: payload?.address,
            date_of_birth: payload?.dob,
            email: payload?.email,
            first_name: payload?.firstname,
            last_name: payload?.lastname,
            gender: payload?.gender,
            language: payload?.language,
            user_uuid: payload?.user_uuid,
            insurances: payload?.insurances,
            is_active: payload?.active,
            phone_no: payload?.phone_no ? payload.phone_no : null,
            uuid:payload?.uuid,
            docsink_created_at:payload?.created_at,
            docsink_updated_at:payload?.updated_at,
            content: payload
        }
        return data;
    } catch (error) {
        this._getBadRequestError(`Error in mydata patient to docsinkpatient format conversion:${error.message}`);

    }
}