
import { useEffect, useState } from "react";
import NotificationBar from "../NotificationBar";
import KeyInput from "./KeyInput";
import PropTypes from "prop-types";
import { getSolBalance, airdropWallet } from '../../utils/solana';
import Transaction from "../Transaction";

const WalletItem = ({ solWalletLength, isDarkMode, wallet, index }) => {
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isTransfer, setIsTransfer] = useState(false);


    const fetchBalance = async () => {
        setLoading(true);
        const balance = await getSolBalance(wallet[1]);
        setBalance(balance);
        setLoading(false);
    }

    useEffect(() => {
        fetchBalance();
    }, [wallet]);

    const refreshBalance = async () => {
        setLoading(true);
        try {
            const balance = await getSolBalance(wallet[1]);
            setBalance(balance);
        } catch (error) {
            console.error("Error refreshing balance:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleAirdrop = async () => {
        setLoading(true);
        try {
            setShowNotification(true)
            setNotificationMessage("Airdrop initialized")
            await airdropWallet(wallet[1]);
            setShowNotification(true)
            setNotificationMessage("Airdrop successful")
            await refreshBalance();
        } catch (error) {
            console.error("Error during airdrop:", error);
            setShowNotification(true);
            setNotificationMessage("Airdrop failed")
        } finally {
            setLoading(false);
        }
    }

    const handleTransaction = () => {
        setIsTransfer(true);
    }



    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setShowNotification(true);
    };

    const handleCloseNotification = () => setShowNotification(false);
    const timer = 4;

    // const togglePrivateKeys = () => setShowPrivate((prev) => !prev);

    return (
        <div
            className={`mb-4 p-4 ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}   rounded-lg shadow-md`}
        >
            <div className="flex justify-between ">
                <h3 className="text-xl font-semibold mb-2flex justify-center">
                    {index + 1 > solWalletLength ? (
                        <>Etherium Wallet {index + 1 - solWalletLength}</>
                    ) : (
                        <>Solana Wallet {index + 1}</>
                    )}
                </h3>
                <div className="flex gap-2 ">
                    Balance: {loading ? "Loading..." : balance + " SOL"}
                    <button
                        onClick={refreshBalance}
                        className="text-white rounded flex justify-center pt-2"
                    >
                        <svg
                            fill={isDarkMode ? "#fff" : "#000000"}
                            height="12px"
                            width="12px"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 383.75 383.75"
                            xmlSpace="preserve"
                            stroke="#000000"
                            strokeWidth="0.00383748"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke="#CCCCCC"
                                strokeWidth="0.767496"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <g>
                                    <path d="M62.772,95.042C90.904,54.899,137.496,30,187.343,30c83.743,0,151.874,68.13,151.874,151.874h30 C369.217,81.588,287.629,0,187.343,0c-35.038,0-69.061,9.989-98.391,28.888C70.368,40.862,54.245,56.032,41.221,73.593 L2.081,34.641v113.365h113.91L62.772,95.042z"></path>
                                    <path d="M381.667,235.742h-113.91l53.219,52.965c-28.132,40.142-74.724,65.042-124.571,65.042 c-83.744,0-151.874-68.13-151.874-151.874h-30c0,100.286,81.588,181.874,181.874,181.874c35.038,0,69.062-9.989,98.391-28.888 c18.584-11.975,34.707-27.145,47.731-44.706l39.139,38.952V235.742z"></path>
                                </g>
                            </g>
                        </svg>
                    </button>
                </div>

            </div>

            <div className="space-y-4">
                <KeyInput
                    label="Adresss"
                    value={wallet[1]}
                    isDarkMode={isDarkMode}
                    onCopy={() => {
                        copyToClipboard(wallet[1]);
                        setNotificationMessage("Wallet Address copied");
                    }}
                />

                <KeyInput
                    label="Private Key"
                    value={wallet[0]}
                    isDarkMode={isDarkMode}
                    type={showPrivateKey ? "text" : "password"}
                    onCopy={() => {
                        copyToClipboard(wallet[0]);
                        setNotificationMessage("Private Key Copied");
                    }}
                    onToggleShow={() => {
                        setShowPrivateKey(!showPrivateKey);
                    }}
                    showToggle={true}
                />
            </div>
            <div className={`${isTransfer ? 'block' : 'hidden'}`}>
                <Transaction wallet={wallet} isDarkMode={isDarkMode} refreshBalance={refreshBalance} />
            </div>
            <div className="flex justify-between">
                <div>
                    <button
                        onClick={handleAirdrop}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Airdrop
                    </button>
                </div>
                <div>
                    {!isTransfer && (
                        <button
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={handleTransaction}
                        >
                            Transfer
                        </button>
                    )}
                    {isTransfer && (
                        <button
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => setIsTransfer(false)}
                        >
                            Back
                        </button>
                    )}
                </div>
            </div>


            {showNotification && (
                <NotificationBar
                    message={notificationMessage}
                    timer={timer}
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );
};

WalletItem.propTypes = {
    solWalletLength: PropTypes.number,
    index: PropTypes.number,
    wallet: PropTypes.arrayOf(PropTypes.any),
    isDarkMode: PropTypes.bool,
};

export default WalletItem;