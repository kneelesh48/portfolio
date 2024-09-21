"use client"

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTheme } from "../context/ThemeContext";

export default function PayPalFeeCalculator() {
    const [includeSellixFee, setIncludeSellixFee] = useState(false);
    const [net, setNet] = useState('10');
    const [total, setTotal] = useState('');
    const [paypalFee, setPaypalFee] = useState('0');
    const [sellixFee, setSellixFee] = useState('0');
    const [totalFee, setTotalFee] = useState('0');
    const [percentFee, setPercentFee] = useState('0');
    const [mounted, setMounted] = useState(false);
    const { darkMode } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const sellix_fee_percentage = 3 / 100;
    const tax = 1.18;

    useEffect(() => {
        const storedIncludeSellixFee = localStorage.getItem("include_sellix_fee") === "true";
        setIncludeSellixFee(storedIncludeSellixFee);
    }, []);

    const feeCalculatorFromTotal = () => {
        const totalValue = Number(total);
        let sellixFeeValue = 0;
        let paypalFeeValue = 0;
        let totalFeeValue = 0;
        let netValue = 0;
        let percentFeeValue = 0;

        if (!includeSellixFee) { // without sellix fee
            paypalFeeValue = (totalValue * 4.4 / 100 + 0.3) * tax;
            totalFeeValue = paypalFeeValue;
        } else { // with sellix fee
            paypalFeeValue = (totalValue * 4.4 / 100 + 0.3) * tax;
            sellixFeeValue = totalValue * sellix_fee_percentage;
            totalFeeValue = paypalFeeValue + sellixFeeValue;
        }

        netValue = totalValue - totalFeeValue;
        percentFeeValue = (totalFeeValue / netValue) * 100;

        // Update state
        setNet(netValue.toFixed(2));
        setPaypalFee(paypalFeeValue.toFixed(2));
        setSellixFee(sellixFeeValue.toFixed(2));
        setTotalFee(totalFeeValue.toFixed(2));
        setPercentFee(percentFeeValue.toFixed(2));
    };

    const feeCalculatorFromNet = () => {
        const netValue = Number(net);
        let sellixFeeValue = 0;
        let paypalFeeValue = 0;
        let totalFeeValue = 0;
        let totalValue = 0;
        let percentFeeValue = 0;

        if (!includeSellixFee) { // without sellix fee
            paypalFeeValue = (netValue * (4.4 * tax / 100) + 0.3 * tax) / (1 - 4.4 * tax / 100);
            totalFeeValue = paypalFeeValue;
        } else { // with sellix fee
            totalFeeValue = (netValue * (4.4 / 100 * tax + sellix_fee_percentage) + 0.3 * tax) / (1 - (4.4 / 100 * tax + sellix_fee_percentage));
            sellixFeeValue = (netValue + totalFeeValue) * sellix_fee_percentage;
            paypalFeeValue = totalFeeValue - sellixFeeValue;
        }

        totalValue = netValue + totalFeeValue;
        percentFeeValue = (totalFeeValue / netValue) * 100;

        // Update state
        setTotal(totalValue.toFixed(2));
        setPaypalFee(paypalFeeValue.toFixed(2));
        setSellixFee(sellixFeeValue.toFixed(2));
        setTotalFee(totalFeeValue.toFixed(2));
        setPercentFee(percentFeeValue.toFixed(2));
    };

    const resetValues = () => {
        setNet('10');
        setTotal('');
        setPaypalFee('0');
        setSellixFee('0');
        setTotalFee('0');
        setPercentFee('0');
        feeCalculatorFromNet();
    };

    const handleIncludeSellixFeeChange = (checked: boolean) => {
        setIncludeSellixFee(checked);
        localStorage.setItem("include_sellix_fee", checked.toString());
    };

    useEffect(() => {
        resetValues();
    }, [includeSellixFee]);

    useEffect(() => {
        feeCalculatorFromNet();
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className={`h-[calc(100vh-72px)] flex flex-col items-center p-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h1 className="text-4xl font-bold mb-4">PayPal Fee Calculator</h1>
            <div className={`p-6 rounded w-full max-w-md border-2 ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                <h3 className="text-lg mb-4">Total=Net+Fee</h3>

                <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                        id="include_sellix_fee"
                        checked={includeSellixFee}
                        onCheckedChange={handleIncludeSellixFeeChange}
                    />
                    <Label htmlFor="include_sellix_fee">Account for sellix fee</Label>
                </div>

                <div className="space-y-4 w-full max-w-md">
                    <div>
                        <Label htmlFor="total">Total (Amount sent):</Label>
                        <Input
                            type="number"
                            id="total"
                            className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                            onKeyUp={feeCalculatorFromTotal}
                        />
                    </div>

                    <div>
                        <Label htmlFor="net">Net (Amount received):</Label>
                        <Input
                            type="number"
                            id="net"
                            className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                            value={net}
                            onChange={(e) => setNet(e.target.value)}
                            onKeyUp={feeCalculatorFromNet}
                        />
                    </div>

                    <p>
                        PayPal Fee: <b>${paypalFee}</b> Sellix Fee: <b>${sellixFee}</b>
                        <br />
                        Total Fee: <b>${totalFee}</b> Percentage Fee: <b>{percentFee}%</b>
                    </p>
                </div>
            </div>

        </div>
    );
}