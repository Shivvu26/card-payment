const API_URL = 'https://run.mocky.io/v3/0b14a8da-5fc7-4443-8511-53d687399bc9';

const CardService = {
    submitCardDetails: async (formData) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://instacred.me'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    }
};

export default CardService;
