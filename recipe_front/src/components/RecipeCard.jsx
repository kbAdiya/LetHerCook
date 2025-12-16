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

function RecipeCard({ recipe, initialIsFavorite = false }) {
  const { user } = useAuth(); // Чтобы проверить, вошел ли юзер
  
  // Передаем ID и начальное состояние в хук
  const { isFavorite, toggleFavorite, loading } = useFavorite(recipe.id, initialIsFavorite);

  return (
    <div 
      className="recipe-card" 
      style={{ 
        border: '1px solid #ddd', 
        padding: '10px', 
        borderRadius: '8px', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {/* Картинка */}
        <img 
          src={recipe.photo} 
          alt={recipe.name} 
          width="100%" 
          style={{ borderRadius: '4px', height: '200px', objectFit: 'cover' }} 
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <h3 style={{ margin: 0 }}>{recipe.name}</h3>
          
          {/* Сердечко показываем ТОЛЬКО авторизованным */}
          {user && (
            <button 
              onClick={toggleFavorite} 
              disabled={loading} // Блокируем кнопку пока идет запрос
              style={{
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '1.5rem',
                padding: '0 5px',
                transition: 'transform 0.1s active'
              }}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {loading ? (
                // Можно добавить спиннер, но пока просто песочные часы или ...
                <span style={{ fontSize: '1rem' }}>⏳</span>
              ) : (
                isFavorite ? <span style={{ color: 'red' }}>❤️</span> : <span>🤍</span>
              )}
            </button>
          )}
        </div>

        <p style={{ color: '#555', fontSize: '0.9rem' }}>
          {recipe.description ? recipe.description.substring(0, 80) + "..." : "No description"}
        </p>
      </div>

      {/* Кнопка Details */}
      <Link 
        to={`/recipes/${recipe.id}`} 
        style={{ 
          display: 'inline-block', 
          marginTop: '10px', 
          padding: '8px 16px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '4px',
          textAlign: 'center'
        }}
      >
        Details
      </Link>
    </div>
  );
}

export default RecipeCard;