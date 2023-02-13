# oci-visualization-tool

oci-visualization-tool helps users with an Oracle Cloud Infrastructure (OCI) account monitor service limits, usage, availability, and quota for every limit with regional or availability domain (AD) scope.

## Requirements

[A configuration file is needed so the app can access user credentials](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm).
For the backend to run correctly, the required location of the config file is `~/.oci/config`. It is also necessary for the key_file to be in the `~/.oci` directory, and the path in the key_file entry in the config file has to be defined with a `~` (absolute path won't work).
For example, there is a file with the name of **key.pem** and a file with the name **config** in the `~/.oci` directory. The key_file entry in the config file would look like this: `key_file=~/.oci/key.pem`

## Getting Started

To run the app, clone the repository and use this command in the project root directory:

```bash
docker-compose up -d
```

The command starts both the backend and the frontend. The app should be available on the **`localhost:5173`**

## Usage

### Limits Fetch

There are two options for limit fetch.

1. Fill out the compartment, region, and service dropdowns. This option will retrieve all limits for every combination of compartment, region, and service. ![compartmen_region_service](/assets/images/compartment_region_service.png)
2. Fill out the compartment, region, service, and limit dropdowns. This option will retrieve limit values for the chosen limits in every combination of compartment, region, and service(if the chosen limits belong to the chosen services). ![compartmen_region_service_limit](/assets/images/compartment_region_service_limit.png)

Any other combination will result in an empty response.
Request responses are cached so that duplicate requests are faster. However, if the "Invalide limit cache" option is checked, all cached limits are deleted, and every new request must fetch the limits from the OCI API again.

### Accordion Display

There are two hierarchical options to display limit tables, limits per compartment and limits per service.

**Limits per compartment** display limits in the following nested way:

```text
compartments > regions > services > limit tables
```

**Limits per service** display limits in the following nested way:

```text
services > compartments > regions > limit tables
```

### Table Configuration Options

- **Sum AD resources**: if checked, sums resources for every limit in multiple Availability Domains.
- **Show deprecated limits**: if checked, deprecated limits will also be displayed.
- **Hide limits with no service limit/availability/used/quota**: limit with no service limit/availability/used/quota is a limit with "0" or "n/a" in the place of service limit/availability/used/quota. These options work together like a logical "and" statement. So, for example, if the limit has no quota and availability and "Hide limits with no quota" and "Hide limits with no availability" are checked, the limit will hide. However, if for the same limit, only "Hide limits with no quota" is checked out of the four options, the limit will not hide because "Hide limits with no availability" remains unchecked.

## Export to JSON or CSV

- exported JSON is in the format of a list of objects, where each object represents a limit. The limit object has a format of stringified "UniqueLimit"(interface defined in the common package)
- in the exported CSV, each limit has its row. The columns are: COMPARTMENT,REGION,SERVICE,LIMIT,SCOPE,SERVICE LIMIT,AVAILABLE,USED,QUOTA
