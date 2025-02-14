package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "os"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

type Flight struct {
    ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Airline       string             `json:"airline" bson:"airline"`
    FlightNumber  string             `json:"flight_number" bson:"flight_number"`
    Departure     string             `json:"departure" bson:"departure"`
    Arrival       string             `json:"arrival" bson:"arrival"`
    DepartureTime string             `json:"departure_time" bson:"departure_time"`
    ArrivalTime   string             `json:"arrival_time" bson:"arrival_time"`
    Gate          string             `json:"gate" bson:"gate"`
}

var collection *mongo.Collection

func initMongoDB() {
    mongoURI := os.Getenv("MONGO_URI")
    if mongoURI == "" {
        mongoURI = "mongodb://localhost:27017"
    }

    clientOptions := options.Client().ApplyURI(mongoURI)
    client, err := mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatal("Error connecting to MongoDB:", err)
    }

    fmt.Println("Connected to MongoDB!")
    collection = client.Database("flightmanagement").Collection("flights")
}

func createFlight(c *gin.Context) {
    var newFlight Flight
    if err := c.ShouldBindJSON(&newFlight); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
        return
    }

    newFlight.ID = primitive.NewObjectID()

    _, err := collection.InsertOne(context.TODO(), newFlight)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert the flight details"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "Flight added successfully!",
        "flight":  newFlight,
    })
}

func getFlights(c *gin.Context) {
    cursor, err := collection.Find(context.TODO(), bson.M{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching flight details"})
        return
    }
    defer cursor.Close(context.TODO())

    var flights []Flight
    for cursor.Next(context.TODO()) {
        var flight Flight
        if err := cursor.Decode(&flight); err != nil {
            continue
        }
        flights = append(flights, flight)
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Flights retrieved successfully",
        "flights": flights,
    })
}

func getFlight(c *gin.Context) {
    id := c.Param("id")
    objID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
        return
    }

    var flight Flight
    err = collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&flight)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Flight not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Flight retrieved successfully",
        "flight":  flight,
    })
}

func updateFlight(c *gin.Context) {
    id := c.Param("id")
    objID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
        return
    }

    var updatedFlight Flight
    if err := c.ShouldBindJSON(&updatedFlight); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
        return
    }

    _, err = collection.UpdateOne(context.TODO(), bson.M{"_id": objID}, bson.M{"$set": updatedFlight})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update flight"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Flight updated successfully!",
        "flight":  updatedFlight,
    })
}

func deleteFlight(c *gin.Context) {
    id := c.Param("id")
    objID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
        return
    }

    _, err = collection.DeleteOne(context.TODO(), bson.M{"_id": objID})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete the flight details"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Flight deleted successfully!"})
}

func main() {
    initMongoDB()
    r := gin.Default()

    // Enable CORS Middleware
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5174"}, // Anyone can access API
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Content-Type"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    }))

    r.GET("/flights", getFlights)
    r.GET("/flights/:id", getFlight)
    r.POST("/flights", createFlight)
    r.PUT("/flights/:id", updateFlight)
    r.DELETE("/flights/:id", deleteFlight)

    port := "8080"
    fmt.Printf("Server is running at: http://localhost:%s\n", port)
    r.Run(":" + port)
}
