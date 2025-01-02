import { FormDataType } from "@/types/form";
import { TableRowData } from "@/types/table";

export const calculateRetirementSavings = (data: FormDataType): TableRowData[] => {
    const {
        currentAge,
        retirementAge,
        lifeExpectancy,
        startingAssets,
        monthlyIncome,
        monthlyExpenses,
        investment,
    } = data;

    const Investments_Return = investment.reduce((acc, item) => {
        return acc + (parseFloat(item.percentage) * parseFloat(item.return)) / 100;
    }, 0);

    const percentage_corpus =
        Number(startingAssets) / (Number(monthlyExpenses) * 12);
    const return_year = Investments_Return;
    const avg_return_month = Number(return_year) / 12;

    let income_invest = 0;
    let previous_Nx = Number(startingAssets);
    let month = 1;

    // Array to store the calculated data
    const result: TableRowData[] = [];

    for (
        let age = parseInt(currentAge) * 12;
        age < parseInt(lifeExpectancy) * 12;
        age++
    ) {
        const year = month / 12;
        const runningAge = parseInt(currentAge) + year;
        const N = percentage_corpus + year / 2;
        const Nx = previous_Nx + Number(income_invest);
        const yearly_expenses = Number(Nx) / Number(N);
        const monthly_expenses = yearly_expenses / 12;
        const monthly_income =
            Number(runningAge) <= Number(retirementAge) ? Number(monthlyIncome) : 0;
        const expected_income = (avg_return_month * Nx) / 100;
        income_invest = monthly_income - monthly_expenses + expected_income;

        // Create the object for the current iteration
        result.push({
            runningAge: Intl.NumberFormat("en-IN", {
                maximumFractionDigits: 2,
            }).format(Number(runningAge)),

            year: Intl.NumberFormat("en-IN", {
                maximumFractionDigits: 2,
            }).format(year),

            month: Intl.NumberFormat("en-IN").format(month),

            N: Intl.NumberFormat("en-IN").format(N),

            Nx: Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }).format(Nx),

            yearly_expenses: Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }).format(yearly_expenses),

            monthly_expenses: Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }).format(monthly_expenses),

            monthly_income: Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }).format(monthly_income),

            income_Nx: Intl.NumberFormat("en-IN", {
                style: "percent",
                currency: "INR",
                maximumFractionDigits: 2,
            }).format(avg_return_month / 100),

            expected_income: Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }).format(expected_income),

            income_invest: Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }).format(income_invest),
        }
        );
        month += 1;
        previous_Nx = Nx;
    }
    return result;
};
