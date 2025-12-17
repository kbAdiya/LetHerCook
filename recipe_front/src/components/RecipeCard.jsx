// // import { Link } from "react-router-dom";

// // function RecipeCard({ recipe }) {
// //   return (
// //     <div>
// //       <img src={recipe.photo} alt={recipe.name} width="200" />
// //       <h3>{recipe.name}</h3>
// //       <p>{recipe.description}</p>
// //       <Link to={`/recipes/${recipe.id}`}>Details</Link>
// //     </div>
// //   );
// // }

// // export default RecipeCard;
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; 
// import { useFavorite } from "../hooks/useFavorite";


// function RecipeCard({ recipe, initialIsFavorite = false }) {
//   const { user } = useAuth(); // Проверяем, авторизован ли юзер
  
//   // Подключаем наш хук. Передаем ID и начальное состояние
//   const { isFavorite, toggleFavorite, loading } = useFavorite(recipe.id, initialIsFavorite);

//   return (
//     <div className="recipe-card" style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', position: 'relative' }}>
//       <img src={recipe.photo} alt={recipe.name} width="200" style={{borderRadius: '4px'}} />
      
//       <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
//         <h3>{recipe.name}</h3>
        
//         {/* Показываем сердце только если юзер авторизован */}
//         {user && (
//           <button 
//             onClick={toggleFavorite} 
//             disabled={loading}
//             style={{
//               background: 'none', 
//               border: 'none', 
//               cursor: 'pointer', 
//               fontSize: '1.5rem',
//               transition: 'transform 0.2s'
//             }}
//             title={isFavorite ? "Remove from favorites" : "Add to favorites"}
//           >
//             {/* Если isFavorite = true, рисуем красное сердце, иначе прозрачное */}
//             {isFavorite ? (
//               <span style={{ color: 'red' }}>❤️</span>
//             ) : (
//               <span style={{ color: 'grey' }}>🤍</span>
//             )}
//           </button>
//         )}
//       </div>

//       <p>{recipe.description}</p>
      
//       {/* Ссылка на детали */}
//       <Link to={`/recipes/${recipe.id}`} className="details-btn">Details</Link>
//     </div>
//   );
// }

// export default RecipeCard;
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { useFavorite } from "../hooks/useFavorite";
import "../styles/recipecard.css";

function RecipeCard({ recipe, initialIsFavorite = false }) {
  const { user } = useAuth(); // Чтобы проверить, вошел ли юзер
  
  // Передаем ID и начальное состояние в хук
  const { isFavorite, toggleFavorite, loading } = useFavorite(recipe.id, initialIsFavorite);

  return (
    <div className="recipeCard">
  <div style={{ position: 'relative', overflow: 'hidden' }}>
    <img
      className="recipeCardMedia"
      src={recipe.photo}
      alt={recipe.name}
      loading="lazy"
    />
    {/* Heart button removed from here */}
  </div>

  <div className="recipeCardBody">
    {/* New wrapper for Title and Heart */}
    <div className="recipeCardHeader">
      <h3 className="recipeCardTitle">{recipe.name}</h3>
      {user && (
        <button
          className={`favoriteBtn ${isFavorite ? "active" : ""}`}
          onClick={toggleFavorite}
        >
          {loading ? "..." : isFavorite ? <span className="heart">♥</span> : <span className="heart">♡</span>}
        </button>
      )}
    </div>
    
    <p className="recipeCardDesc">{recipe.description || "No description"}</p>
    <Link to={`/recipes/${recipe.id}`} className="detailsBtn">
      Details
    </Link>
  </div>
</div>
//     <div className="recipeCard">
//   <div style={{ position: 'relative', overflow: 'hidden' }}>
//     <img
//       className="recipeCardMedia"
//       src={recipe.photo}
//       alt={recipe.name}
//       loading="lazy"
//     />
//     {user && (
//       <button
//         className={`favoriteBtn ${isFavorite ? "active" : ""}`}
//         onClick={toggleFavorite}
// >
//         {loading ? "..." : isFavorite ? <span className="heart">♥</span> : <span className="heart">♡</span>}
//      </button>

//     )}
//   </div>

//   <div className="recipeCardBody">
//     <h3 className="recipeCardTitle">{recipe.name}</h3>
//     <p className="recipeCardDesc">{recipe.description || "No description"}</p>
//     <Link to={`/recipes/${recipe.id}`} className="detailsBtn">
//       Details
//     </Link>
//   </div>
// </div>
  );
}

export default RecipeCard;