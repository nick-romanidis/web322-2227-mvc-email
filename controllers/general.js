const express = require("express");
const router = express.Router();

// Add your routes here
// e.g. app.get() { ... }

router.get("/", (req, res) => {
    res.render("general/home", {
        title: "Home Page"
    });
});

// Add routes for the "Contact-Us" page
router.get("/contact-us", (req, res) => {
    res.render("general/contactUs", {
        title: "Contact Us"
    });
});

router.post("/contact-us", (req, res) => {
    console.log(req.body);

    const { firstName, lastName, email, message } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    if (typeof firstName !== "string" || firstName.trim().length == 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.firstName = "You must specify a first name";
    }
    else if (typeof firstName !== "string" || firstName.trim().length <= 2) {
        // First name is not a string, or, first name is only a single character.
        passedValidation = false;
        validationMessages.firstName = "The first name should be at least 2 characters long.";
    }

    if (passedValidation) {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: "nick.romanidis@gmail.com", //email
            from: "nick.romanidis@senecacollege.ca",
            subject: "Contact Us Form Submission",
            html:
                `Visitor's Full Name: ${firstName} ${lastName}<br>
                Visitor's Email Address: ${email}<br>
                Visitor's message: ${message}<br>
                `
        };

        sgMail.send(msg)
            .then(() => {
                res.send("Success, validation passed and email has been sent.");
            })
            .catch(err => {
                console.log(err);

                res.render("general/contactUs", {
                    title: "Contact Us",
                    values: req.body,
                    validationMessages
                });
            });

    }
    else {
        res.render("general/contactUs", {
            title: "Contact Us",
            values: req.body,
            validationMessages
        });
    }

});

module.exports = router;