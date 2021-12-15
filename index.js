require('./models/index.js');
const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}));
// general routes
require('./routes/v1/BranchRoute')(app)
require('./routes/v1/DepTypeRoute')(app)
require('./routes/v1/EntityRoute')(app)
require('./routes/v1/PostRoute')(app)
require('./routes/v1/PostGroupRoute')(app)
require('./routes/v1/RegionRoute')(app)

// personal routes
require('./routes/v1/Personal/PersonalRoute')(app)
require('./routes/v1/Personal/EducationRoute')(app)
require('./routes/v1/Personal/EmploymentRoute')(app)
require('./routes/v1/Personal/FamilyRoute')(app)
require('./routes/v1/Personal/LangsRoute')(app)
require('./routes/v1/Personal/PrizeRoute')(app)
require('./routes/v1/Personal/PhoneRoute')(app)


// require('./routes/v1')(app);
require('./routes/v1/refs/BankRoute')(app)
require('./routes/v1/refs/DistrRoute')(app)
require('./routes/v1/refs/EducationRoute')(app)
require('./routes/v1/refs/EducationTypeRoute')(app)
require('./routes/v1/refs/FamilyRoute')(app)
require('./routes/v1/refs/FamilyStatusRoute')(app)
require('./routes/v1/refs/LangRoute')(app)
require('./routes/v1/refs/LangsRoute')(app)
require('./routes/v1/refs/MfoRoute')(app)
require('./routes/v1/refs/NationRoute')(app)
require('./routes/v1/refs/ObrazRoute')(app)
require('./routes/v1/refs/PartyRoute')(app)
require('./routes/v1/refs/PostCBRoute')(app)
require('./routes/v1/refs/PrichRoute')(app)
require('./routes/v1/refs/RegionRoute')(app)
require('./routes/v1/refs/StrRoute')(app)
require('./routes/v1/refs/UchStepRoute')(app)
require('./routes/v1/refs/UchZavRoute')(app)
require('./routes/v1/refs/UchZvnRoute')(app)

// specific routes
// require('./routes/v1/testRoute')(app);
// require('./routes/v1/userRoute')(app);

// handle undefined routes
app.use("*", (req, res) => {
    res.status(404).json({
        success: "false",
        message: "Page not found",
        error: {
            statusCode: 404,
            message: "You reached a route that is not defined on this server",
        },
    });
});


// set port, listen for requests
const PORT = process.env.PORT || 6677;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});