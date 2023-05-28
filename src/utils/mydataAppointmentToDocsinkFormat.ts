import moment from "moment";

export async function mydataAppointmentTypeFormat(payload, botConfig) {
    try {
        let data =
        {
            id: botConfig?.mydata_AppointmentType_id,
            mydata_configuration: botConfig?.mydata_configuration,
            name: payload?.type?.coding[0]?.display,
            code: payload?.type?.coding[0]?.code,
            content: payload?.type?.coding[0]

        }
        return data;

    } catch (error) {
        this._getBadRequestError(`Error in mydata AppointmentType to docsink format conversion:${error.message}`);

    }
}


export async function docsinkOrgAppointmentTypeFormat(payload: any) {
    try {
        let data =
        {
            name: payload?.name,
            description: payload?.code,
        }
        return data;

    } catch (error) {
        this._getBadRequestError(`Error in mydata orgdocsinkAppointmentType to docsink format conversion:${error.message}`);

    }
}


export async function DocsinkAppointmentTypeFormat(payload, botConfig) {
    try {
        let data =
        {
            docsink_organization: botConfig?.docsink_organization,
            is_active: payload?.active,
            name: payload?.name,
            uuid: payload?.uuid,
            description: payload?.description,
            hcpcs: payload?.hcpcs,
            is_global: payload?.is_global,
            length: payload.length
        }

        return data;

    } catch (error) {
        this._getBadRequestError(`Error in mydata docsinkAppointmentType to docsink format conversion:${error.message}`);

    }
}

export async function mydataAppointmentFormat(payload, botConfig) {
    try {
        let data =
        {
            id: botConfig?.mydata_appointment_id,
            mydata_configuration: botConfig?.mydata_configuration,
            content: payload,
            appointment_id: payload?.id,
            security: payload?.meta?.security[0]?.display,
            status: payload?.status,
            start_date:payload?.start ? moment(payload?.start).utc().format('YYYY-MM-DDTHH:mm:ss.SSS'): null,
            end_date: payload?.end ? moment(payload?.end).utc().format('YYYY-MM-DDTHH:mm:ss.SSS') : null,
            duration: Number(payload?.minutesDuration),
            slot: payload?.slot[0],
            last_updated_at: payload.meta?.lastUpdated ? moment(payload.meta.lastUpdated).utc().format('YYYY-MM-DDTHH:mm:ss.SSS') : null,
            mydata_appointment_type: botConfig?.appointment_type?.mydata_appointment_type_id,
            mydata_patient: botConfig?.patient?.mydata_patient_id,
            mydata_practitioner: botConfig?.practitioner?.mydata_practitioner_id,
            mydata_location: botConfig?.location?.mydata_location_id

        }
        return data;
    } catch (error) {
        this._getBadRequestError(`Error in mydata Appointment format conversion:${error.message}`);

    }
}

export async function docsinkOrgAppointmentFormat(payload, botConfig) {
    try {
        let active;
        if (payload.status == 'booked' || payload.status == 'fulfilled') {
            active = 1;
        }
        else {
            active = 0
        }
        let data =
        {
            appointment_date_utc: payload?.start_date,
            appointment_type_id: botConfig?.appointment_type.docsink_appointment_type_uuid,
            location_id: botConfig?.location.docsink_location_uuid,
            patient_id: botConfig?.patient.docsink_patient_uuid,
            provider_id: botConfig?.practitioner.docsink_provider_uuid,
            status: payload.status,
            active: active

        }
        return data;

    } catch (error) {
        this._getBadRequestError(`Error in mydata Appointment to docsink format conversion:${error.message}`);

    }
}

export async function docsinkAppointmentFormat(payload, botConfig) {
    try {
        let data =
        {
            docsink_organization: botConfig?.docsink_organization,
            appointment_type:botConfig?.appointment_type.docsink_appointment_type_id,
            docsink_location: botConfig?.location.docsink_location_id,
            docsink_patient: botConfig?.patient.docsink_patient_id,
            docsink_provider: botConfig?.practitioner.docsink_provider_id,
            uuid:payload?.uuid,
            appointment_date: payload?.appointment_date,
            appointment_timezone: payload?.appointment_timezone,
            active: payload?.active,
            confirmation_status: payload?.status,
            docsink_created_at:payload?.created_at,
            docsink_updated_at:payload?.updated_at,
            content: payload
        }
        return data;
    } catch (error) {
        this._getBadRequestError(`Error in mydata patient to docsinkAppointment format conversion:${error.message}`);

    }
}





