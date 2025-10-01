import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getRestaurantById, updateRestaurant } from "../service/restaurantsService";
import { useUser } from "../users/UserContext";

const EditRestaurant = () => {
  const { id } = useParams();
  const { userId } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantById(id);
        setValue("name", data.name);
        setValue("address", data.address);
        setValue("description", data.description);
        setValue("phone", data.phone);
        if (data.photoUrl) {
          setPreviewImage(`http://localhost:5065${data.photoUrl}`);
        }
      } catch (err) {
        console.error("Greška pri učitavanju restorana:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("Name", data.name);
      formData.append("Address", data.address || "");
      formData.append("Description", data.description || "");
      formData.append("Phone", data.phone || "");
      if (data.photo?.[0]) formData.append("Photo", data.photo[0]);

      await updateRestaurant(id, formData);
      alert("Restoran uspešno ažuriran!");
      navigate("/restaurants/dashboard");
    } catch (err) {
      console.error("Greška pri ažuriranju restorana:", err);
      alert("Došlo je do greške pri ažuriranju.");
    }
  };

  const photoFile = watch("photo");
  useEffect(() => {
    if (photoFile && photoFile[0]) {
      setPreviewImage(URL.createObjectURL(photoFile[0]));
    }
  }, [photoFile]);

  if (loading) return <p>⏳ Učitavanje...</p>;

  return (
    <div className="edit-restaurant">
      <div className="edit-restaurant__container">
        <div className="edit-restaurant__header">
          <h1>Uredi restoran</h1>
        </div>

        <form className="restaurant-form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="form-section">
            <h2>Osnovne informacije</h2>

            <div className="form-group">
              <label htmlFor="name">Naziv *</label>
              <input
                id="name"
                type="text"
                className="form-input"
                {...register("name", { required: "Naziv je obavezan" })}
                placeholder="Naziv restorana"
              />
              {errors.name && <p className="error">{errors.name.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Adresa</label>
              <input id="address" type="text" className="form-input" {...register("address")} />
            </div>

            <div className="form-group">
              <label htmlFor="description">Opis</label>
              <textarea id="description" rows="3" className="form-input" {...register("description")} />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefon</label>
              <input id="phone" type="text" className="form-input" {...register("phone")} />
            </div>
          </div>

          <div className="form-section">
            <h2>Fotografija</h2>

            <div className="image-upload">
              <div className="image-preview">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" />
                ) : (
                  <div className="image-placeholder">
                    <span>📷</span>
                    <p>Dodaj fotografiju</p>
                  </div>
                )}
              </div>

              <div className="image-upload-controls">
                <label className="btn btn--secondary" htmlFor="photo">Izaberi fotografiju</label>
                <input
                  id="photo"
                  type="file"
                  className="file-input"
                  accept="image/*"
                  {...register("photo")}
                />
                {photoFile?.[0] && <div className="file-info">{photoFile[0].name}</div>}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn--secondary" onClick={() => navigate(-1)}>
              Otkaži
            </button>
            <button type="submit" className="btn btn--primary">
              💾 Sačuvaj izmene
            </button>
          </div>
        </form>

        <div className="additional-options">
          <h2>Dodatne opcije</h2>
          <div className="options-grid">
            <div className="option-card" onClick={() => navigate(`/restaurants/${id}/working-hours`)}>
              <span>🕒</span>
              <h3>Radno vreme</h3>
              <p>Podesite radne sate za svaki dan</p>
            </div>
            <div className="option-card" onClick={() => navigate(`/restaurants/${id}/closed-dates`)}>
              <span>📅</span>
              <h3>Neradni datumi</h3>
              <p>Upravljajte zatvorenim datumima</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRestaurant;