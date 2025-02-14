import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const ViewFlight = () => {
    const { id } = useParams();
    const [flight, setFlight] = useState(null);
    const [alert, setAlert] = useState({ type: "", message: "" });

    useEffect(() => {
        axios.get(`http://localhost:8080/flights/${id}`)
            .then(response => setFlight(response.data.flight)) // Extract 'flight' from response
            .catch(() => setAlert({ type: "danger", message: "Failed to fetch flight details!" }));
    }, [id]);    

    if (!flight) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            {alert.message && (
                <div className={`alert alert-${alert.type}`} role="alert">
                    {alert.message}
                </div>
            )}
            <h2>Flight Details</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{flight.airline} ({flight.flight_number})</h5>
                    <p><strong>Flight Number:</strong> {flight.flight_number}</p>
                    <p><strong>Airline:</strong> {flight.airline}</p>
                    <p><strong>Departure:</strong> {flight.departure}</p>
                    <p><strong>Arrival:</strong> {flight.arrival}</p>
                    <p><strong>Departure Time:</strong> {flight.departure_time}</p>
                    <p><strong>Arrival Time:</strong> {flight.arrival_time}</p>
                    <p><strong>Gate:</strong> {flight.gate}</p>
                    <Link to="/" className="btn btn-primary">Back to List</Link>
                </div>
            </div>
        </div>
    );
};

export default ViewFlight;
