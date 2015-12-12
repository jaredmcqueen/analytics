Functionality:

-Match threat intel to raw data sets and output one "enriched" csv output for visualization
-Collect data from Malc0de, Emerging Threats, and Zues Tracker -- Requires network connection
-Drop CSVs into "intel" directory -- offline or custom mode
-Drop raw network data into "raw" directory
-Retrieve output from "../examples" directory in the proper format for visualization


Data formats:
-Intel CSVs should have at least one column, the indicator column, but will also take any of the following:
        -Indicator: the IP, domain, email, etc.
        -Reference: where did you retrieve the threat intel
        -Type: Type of indicator (malware hosting, C2, spearphishing, whatever)

-Raw format is looking for a csv with the following columns (names don't matter as they're being overwritten anyway):

        datetime,source,target

       Source and target can be any sort of network object (email, IP, hostname, user, etc.)

*The raw format is static and needs at least three columns. Currently parsing date times, but prefer epoch formats to minimize odd timestamps.

