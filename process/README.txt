Functionality:

-Match threat intel to raw data sets and output one "enriched" csv output for visualization
-Drop CSVs into "intel" directory
-Drop raw data into "raw" directory
-Retrieve output from "../examples" directory in the proper format for visualization


Data formats:

    -Intel CSVs should have at least three columns:
        -Indicator: the IP, domain, email, etc.
        -Reference: where did you retrieve the threat intel
        -Type: Type of indicator (malware hosting, C2, spearphishing, whatever)
    -Doesn't matter what you name the intel columns, just so long as there are three of them. Fixing that soon.

    -Raw format is looking for a csv with the following fields:

        epoch,source,target

        *The raw format is static and needs to have these headers. Working on adding timestamp fixing and
        formatting column headers.

