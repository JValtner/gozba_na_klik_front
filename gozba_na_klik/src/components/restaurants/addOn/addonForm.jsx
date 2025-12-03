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
                <label>Naziv:</label>
                <input
                    {...register("name", {
                        required: "Dodatak je obavezan",
                        maxLength: { value: 100, message: "Prekoracena maksimalna duzina 100 karaktera" },
                    })}
                    type="text"
                    placeholder="Addon name"
                />
                {errors.name && <span className="error-msg">{errors.name.message}</span>}
            </div>

            <div className="form-row">
                <label>Cena:</label>
                <input
                    {...register("price", {
                        required: "Cena je obavezna",
                        min: { value: 0, message: "Cena mora biti pozitivan broj" },
                        max: { value: 5000, message: "Cena je previsoka" },
                    })}
                    type="number"
                    placeholder="Price"
                    step="0.01"
                />
                {errors.price && <span className="error-msg">{errors.price.message}</span>}
            </div>

            <div className="form-row">
                <label>Tip dodatka:</label>
                <select {...register("type", { required: "Type is required" })}>
                    <option value="independent">Nezavisni</option>
                    <option value="chosen">Izabrani</option>
                </select>
                {errors.type && <span className="error-msg">{errors.type.message}</span>}
            </div>

            <button type="submit">Dodaj +</button>
        </form>
    );
};

export default AddonForm;
