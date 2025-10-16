import React from "react";
import { useForm } from "react-hook-form";

const AddonForm = ({ mealId, onSubmit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: "",
            price: 0,
            type: "independent",
        },
    });

    const submitHandler = (data) => {
        onSubmit({ ...data, mealId: Number(mealId) });
        reset();
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="addon-form">
            <div className="form-row">
                <label>Name:</label>
                <input
                    {...register("name", {
                        required: "Addon name is required",
                        maxLength: { value: 100, message: "Cannot exceed 100 characters" },
                    })}
                    type="text"
                    placeholder="Addon name"
                />
                {errors.name && <span className="error-msg">{errors.name.message}</span>}
            </div>

            <div className="form-row">
                <label>Price:</label>
                <input
                    {...register("price", {
                        required: "Price is required",
                        min: { value: 0, message: "Price must be positive" },
                        max: { value: 5000, message: "Price too high" },
                    })}
                    type="number"
                    placeholder="Price"
                    step="0.01"
                />
                {errors.price && <span className="error-msg">{errors.price.message}</span>}
            </div>

            <div className="form-row">
                <label>Type:</label>
                <select {...register("type", { required: "Type is required" })}>
                    <option value="independent">Independent</option>
                    <option value="chosen">Chosen</option>
                </select>
                {errors.type && <span className="error-msg">{errors.type.message}</span>}
            </div>

            <button type="submit">Add</button>
        </form>
    );
};

export default AddonForm;
