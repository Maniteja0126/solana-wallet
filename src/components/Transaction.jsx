import KeyInput from "./ui/KeyInput"
import { useState } from "react"
import { transferSol } from "../utils/solana";
import NotificationBar from "./NotificationBar";
import PropTypes from "prop-types";



const Transaction = ({ wallet, isDarkMode, refreshBalance }) => {
    const [receiverAddress, setReceiverAddress] = useState("");
    const [amount, setAmount] = useState();
    const [notification, setNotification] = useState("");
    const [showNotification, setShowNotification] = useState(false);


    const handleAmountChange = (newAmount) => {
        setAmount(newAmount)
    }

    const handleReceiverAddressChange = (newAddress) => {
        setReceiverAddress(newAddress);
    }

    const handleTransfer = async () => {
        setShowNotification(true);
        const senderPrivateKey = wallet[0];
        setNotification("Transfer Initialized")
        try {
            await transferSol(senderPrivateKey, receiverAddress, amount);
            refreshBalance();
            setReceiverAddress("");
            setAmount("");
            setShowNotification(true);
            setNotification("Transfer Successful");
        } catch (error) {
            console.log(error)
            setShowNotification(true);
            setNotification("Transfer Failed");
        }
    }

    return (
        <div>
            <div className="mt-5">

                <KeyInput
                    label='Receiver Address'
                    value={receiverAddress}
                    isDarkMode={isDarkMode}
                    isEditable={true}
                    onChange={handleReceiverAddressChange}
                />
                <KeyInput
                    label='Amount'
                    value={amount}
                    isDarkMode={isDarkMode}
                    isEditable={true}
                    onChange={handleAmountChange}
                />
            </div>

            <button
                className="mt-2 mb-3 px-4 py-2 bg-blue-500 text-white rounded w-full"
                onClick={handleTransfer}
            >Send</button>

            {showNotification && (
                <NotificationBar
                    message={notification}
                    timer={4}
                    onClose={() => setShowNotification(false)}
                />
            )}
        </div>
    )
}

Transaction.propTypes = {
    wallet: PropTypes.arrayOf(PropTypes.any),
    isDarkMode: PropTypes.bool,
    refreshBalance: PropTypes.func,
}

export default Transaction
