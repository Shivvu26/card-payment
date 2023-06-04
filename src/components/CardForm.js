import React, { useState } from 'react';
import CardService from './CardService';
import '../App.css';

const CardForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        cardNo: '',
        cvv: '',
        expiryMonth: '',
        expiryYear: ''
    });
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await CardService.submitCardDetails(formData);
            setResponse(response);
        } catch (error) {
            console.error(error);
        }
    };

    const validateCardNumber = (cardNo) => {
        // Remove all non-digit characters from the card number
        const cleanCardNo = cardNo.replace(/[^0-9]/g, '');

        // Check card type based on the first digit of the card number
        const firstDigit = cleanCardNo.charAt(0);
        let cardType;
        switch (firstDigit) {
            case '4':
                cardType = 'visa';
                break;
            case '5':
                cardType = 'mastercard';
                break;
            case '3':
                cardType = 'amex';
                break;
            default:
                cardType = 'unknown';
                break;
        }

        // Validate card number based on the card type
        switch (cardType) {
            case 'visa':
                // Visa cards have a length of 16 digits and start with 4
                return /^[0-9]{16}$/.test(cleanCardNo);
            case 'mastercard':
                // Mastercard cards have a length of 16 digits and start with 5
                return /^[0-9]{16}$/.test(cleanCardNo);
            case 'amex':
                // American Express cards have a length of 15 digits and start with 34 or 37
                return /^[0-9]{15}$/.test(cleanCardNo);
            default:
                // For unknown card types, validate the length to be between 13 and 19 digits
                return /^[0-9]{13,19}$/.test(cleanCardNo);
        }
    };

    const formatCardNumber = (cardNo) => {
        // Remove all non-digit characters from the card number
        const cleanCardNo = cardNo.replace(/[^0-9]/g, '');

        // Split the card number into groups of four digits
        const parts = cleanCardNo.match(/.{1,4}/g);

        // Add dashes between the groups of four digits
        return parts ? parts.join('-') : '';
    };


    const validateCVV = (cvv, cardType) => {
        switch (cardType) {
            case 'amex':
                return /^[0-9]{4}$/.test(cvv);
            default:
                return /^[0-9]{3}$/.test(cvv);
        }
    };

    const validateExpiry = (expiryMonth, expiryYear) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        if (expiryYear < currentYear) {
            return false;
        } else if (expiryYear === currentYear && expiryMonth < currentMonth) {
            return false;
        } else {
            return true;
        }
    };

    const renderYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 10 }, (_, index) => currentYear + index);

        return years.map((year, index) => (
            <option key={index} value={year}>
                {year}
            </option>
        ));
    };

    const validateForm = () => {
        const { cardNo, cvv, expiryMonth, expiryYear } = formData;
        const isCardNumberValid = validateCardNumber(cardNo);
        const isCVVValid = validateCVV(cvv);
        const isExpiryValid = validateExpiry(expiryMonth, expiryYear);

        return isCardNumberValid && isCVVValid && isExpiryValid;
    };

    return (
        <div className="card-form-container">
            <div className="card-form">
                <h2>Credit/Debit Card Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cardNo">Card Number:</label>
                        <input
                            type="text"
                            name="cardNo"
                            id="cardNo"
                            value={formatCardNumber(formData.cardNo)}
                            onChange={handleChange}
                            required
                            maxLength={19}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cvv">CVV:</label>
                        <input
                            type="text"
                            name="cvv"
                            id="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            required
                            maxLength={3}
                        />
                    </div>
                    <div className="form-group expiry">
                        <div>
                            <label htmlFor="expiryMonth">Expiry Month:</label>
                            <select
                                name="expiryMonth"
                                id="expiryMonth"
                                value={formData.expiryMonth}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="expiryYear">Expiry Year:</label>
                            <select
                                name="expiryYear"
                                id="expiryYear"
                                value={formData.expiryYear}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Year</option>
                                {renderYearOptions()}
                            </select>
                        </div>
                    </div>
                    <div className="form-group submit-btn">
                        <button type="submit" disabled={!validateForm()}>
                            Submit
                        </button>
                    </div>

                </form>
                {response && (
                    <div className="response">
                        {response.success ? (
                            <p>
                                Success! Request ID: {response.data.requestId}, Name: {response.data.name}, Request Date:{' '}
                                {response.data.requestDate}
                            </p>
                        ) : (
                            <p>Error: {response.data}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardForm;
