import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as bootstrap from "bootstrap";

const Home = () => {
    const [flights, setFlights] = useState([]);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [selectedFlightId, setSelectedFlightId] = useState(null);

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await axios.get("http://localhost:8080/flights");
            setFlights(response.data.flights || []);  // Ensure flights is an array
        } catch (error) {
            setAlert({ type: "danger", message: "Failed to fetch flights!" });
        }
    };

    const confirmDelete = (id) => {
        setSelectedFlightId(id);
        const modalElement = document.getElementById("deleteModal");
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    const deleteFlight = async () => {
        if (!selectedFlightId) return;
        try {
            await axios.delete(`http://localhost:8080/flights/${selectedFlightId}`);
            setFlights(flights.filter(flight => flight.id !== selectedFlightId));
            setAlert({ type: "success", message: "Flight deleted successfully!" });
        } catch (error) {
            setAlert({ type: "danger", message: "Failed to delete the flight!" });
        } finally {
            setSelectedFlightId(null);
            const modalElement = document.getElementById("deleteModal");
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            }
        }
    };

    return (
        <div className="container mt-4">
            {alert.message && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="btn-close" onClick={() => setAlert({ type: "", message: "" })}></button>
                </div>
            )}

            <div className="d-flex justify-content-end mb-3">
                <Link to="/create" className="btn btn-success">Add New Flight</Link>
            </div>

            <h2 className="mb-4">Flight List</h2>
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Airline</th>
                        <th>Flight Number</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Departure Time</th>
                        <th>Arrival Time</th>
                        <th>Gate</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map((flight, index) => (
                        <tr key={flight.id}>
                            <td>{index + 1}</td>
                            <td>{flight.airline}</td>
                            <td>{flight.flight_number}</td>
                            <td>{flight.departure}</td>
                            <td>{flight.arrival}</td>
                            <td>{flight.departure_time}</td>
                            <td>{flight.arrival_time}</td>
                            <td>{flight.gate}</td>
                            <td>
                                <Link to={`/view/${flight.id}`} className="btn btn-info btn-sm">View</Link>
                                <Link to={`/edit/${flight.id}`} className="btn btn-warning btn-sm mx-2">Edit</Link>
                                <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(flight.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete Confirmation Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this flight?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={deleteFlight}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
