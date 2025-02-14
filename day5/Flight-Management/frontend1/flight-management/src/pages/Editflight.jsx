import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditFlight = () => {
    const { id } = useParams();
    const [flight, setFlight] = useState({
        airline: "",
        flight_number: "",
        departure: "",
        arrival: "",
        departure_time: "",
        arrival_time: "",
        gate: ""
    });
    const [alert, setAlert] = useState({ type: "", message: "" });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/flights/${id}`)
            .then(response => setFlight(response.data.flight)) // Fix: Extract 'flight' from response
            .catch(() => setAlert({ type: "danger", message: "Failed to fetch flight details!" }));
    }, [id]);

    const handleChange = (e) => {
        setFlight({ ...flight, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/flights/${id}`, flight);
            setAlert({ type: "success", message: "Flight updated successfully!" });
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setAlert({ type: "danger", message: "Failed to update flight!" });
        }
    };

    return (
        <div className="container mt-4">
            {alert.message && (
                <div className={`alert alert-${alert.type}`} role="alert">
                    {alert.message}
                </div>
            )}
            <h2>Edit Flight Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Airline</label>
                    <input type="text" name="airline" className="form-control" value={flight.airline} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Flight Number</label>
                    <input type="text" name="flight_number" className="form-control" value={flight.flight_number} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Departure</label>
                    <input type="text" name="departure" className="form-control" value={flight.departure} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Arrival</label>
                    <input type="text" name="arrival" className="form-control" value={flight.arrival} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Departure Time</label>
                    <input type="time" name="departure_time" className="form-control" value={flight.departure_time} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Arrival Time</label>
                    <input type="time" name="arrival_time" className="form-control" value={flight.arrival_time} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Gate</label>
                    <input type="text" name="gate" className="form-control" value={flight.gate} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    );
};

export default EditFlight;
