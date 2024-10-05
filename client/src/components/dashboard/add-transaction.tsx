import axios from "axios";
import { useState } from "react";
import { Session } from "next-auth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddTransactionProps {
    session: Session;
}

export default function AddTransaction({ session }: AddTransactionProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        async function PostData() {
            if (!session || !session.user) {
                return;
            }

            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-transaction`,
                    {
                        email_id: session.user.email,
                        category,
                        description,
                        date,
                        amount,
                    },
                );

                toast({
                    title: "Transaction added successfully",
                    description:
                        "Your transaction has been added to the database.",
                });

                setCategory("");
                setDescription("");
                setDate("");
                setAmount("");
                setOpen(false);
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error",
                    description: "There was an error adding your transaction.",
                });
            }
        }

        PostData();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-custom-blue hover:bg-blue-600 transition-all py-1 h-auto">
                    Open
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <DialogDescription>
                        Fill out the details of the transaction.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter category"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="bg-custom-blue hover:bg-blue-600 transition-all"
                    >
                        Submit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
