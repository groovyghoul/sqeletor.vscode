export function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");

    const currentDate = `${year}${month}${day}`;
    return currentDate;
}

export function getAppliedScriptsDate() {
    const now = new Date();

    const year = now.getFullYear().toString();
    const month = getMonthAbbreviation(now.getMonth()).toUpperCase();
    const day = now.getDate().toString().padStart(2, "0");

    const currentDate = `${year}-${month}-${day}`;
    return currentDate;
}

function getMonthAbbreviation(month: number) {
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    return monthNames[month];
}