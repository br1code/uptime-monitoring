// Container for all the environments

var environments = {};

// Staging (default environment)
environments.staging = {
    port: 3000,
    envName: "staging"
};

// Production environment
environments.production = {
    port: 5000,
    envName: "production"
};

// Determine which environment was passed as a command-line argument
var currentEnvironment;

if (typeof(process.env.NODE_ENV) == "string") {
    currentEnvironment = process.env.NODE_ENV;
} else {
    currentEnvironment = "";
}

// Check that the current environment is one of the environments above, if not, default to staging
var environmentToExport;

if (typeof(environments[currentEnvironment]) == "object") {
    environmentToExport = environments[currentEnvironment];
} else {
    environmentToExport = environments.staging;
}

module.exports = environmentToExport;