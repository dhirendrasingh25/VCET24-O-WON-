import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Define the form schema using Zod
const formSchema = z.object({
    age: z.number().min(18, "Age must be at least 18"),
    ailments: z.string().min(1, "Ailments is required"),
    lifestyle: z.string().min(1, "Lifestyle is required"),
    dependents: z.number().min(0, "Dependents must be 0 or more"),
    dependantDescription: z.string().optional(),
    goal: z.string().min(1, "Goal is required"),
    expenses: z.array(
        z.object({
            description: z.string().min(1, "Description is required"),
            amount: z.number().min(0, "Amount must be 0 or more"),
        }),
    ),
    currentInvestments: z.array(z.string().min(1, "Investment is required")),
    duration: z.string().min(1, "Duration is required"),
    review: z.string().min(1, "Review is required"),
});

export default function FormPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <main>
            <Dialog open={true}>
                <DialogTrigger asChild>
                    <Button>Open Form</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Fill out the form</DialogTitle>
                        <DialogDescription>
                            Please fill out the details below to proceed.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Age */}
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input type="number" {...register("age")} />
                            {errors.age && <p>{errors.age.message}</p>}
                        </div>

                        {/* Ailments */}
                        <div>
                            <Label htmlFor="ailments">Ailments</Label>
                            <Input type="text" {...register("ailments")} />
                            {errors.ailments && (
                                <p>{errors.ailments.message}</p>
                            )}
                        </div>

                        {/* Lifestyle */}
                        <div>
                            <Label htmlFor="lifestyle">Lifestyle</Label>
                            <Input type="text" {...register("lifestyle")} />
                            {errors.lifestyle && (
                                <p>{errors.lifestyle.message}</p>
                            )}
                        </div>

                        {/* Dependents */}
                        <div>
                            <Label htmlFor="dependents">Dependents</Label>
                            <Input type="number" {...register("dependents")} />
                            {errors.dependents && (
                                <p>{errors.dependents.message}</p>
                            )}
                        </div>

                        {/* Dependant Description */}
                        <div>
                            <Label htmlFor="dependantDescription">
                                Dependant Description
                            </Label>
                            <Input
                                type="text"
                                {...register("dependantDescription")}
                            />
                            {errors.dependantDescription && (
                                <p>{errors.dependantDescription.message}</p>
                            )}
                        </div>

                        {/* Goal */}
                        <div>
                            <Label htmlFor="goal">Goal</Label>
                            <Input type="text" {...register("goal")} />
                            {errors.goal && <p>{errors.goal.message}</p>}
                        </div>

                        {/* Expenses */}
                        <div>
                            <Label htmlFor="expenses">Expenses</Label>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Description"
                                    {...register("expenses.0.description")}
                                />
                                {errors.expenses?.[0]?.description && (
                                    <p>
                                        {errors.expenses[0].description.message}
                                    </p>
                                )}
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    {...register("expenses.0.amount")}
                                />
                                {errors.expenses?.[0]?.amount && (
                                    <p>{errors.expenses[0].amount.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Current Investments */}
                        <div>
                            <Label htmlFor="currentInvestments">
                                Current Investments
                            </Label>
                            <Input
                                type="text"
                                {...register("currentInvestments.0")}
                            />
                            {errors.currentInvestments?.[0] && (
                                <p>{errors.currentInvestments[0]?.message}</p>
                            )}
                        </div>

                        {/* Duration */}
                        <div>
                            <Label htmlFor="duration">Duration</Label>
                            <Input type="text" {...register("duration")} />
                            {errors.duration && (
                                <p>{errors.duration.message}</p>
                            )}
                        </div>

                        {/* Review */}
                        <div>
                            <Label htmlFor="review">Review</Label>
                            <Input type="text" {...register("review")} />
                            {errors.review && <p>{errors.review.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="mt-4">
                            Submit
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </main>
    );
}
