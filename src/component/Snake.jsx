import { useState, useRef, useEffect } from "react";

export default function Snake() {
  const size = 25;
  const gameSize = Array.from({ length: size }, () => new Array(size).fill(""));
  const [body, setBody] = useState([
    [4, 5]
  ]);
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(()=>{
    return JSON.parse(localStorage.getItem("gameScore")) || 0
  })
  const [speed, setSpeed] = useState(200)
  const isBody = (x, y) => {
    return body.some(([a, b]) => a === x && b === y);
  };
  const food =()=>{
    const x= Math.floor(Math.random()*size)
    const y = Math.floor(Math.random()*size)
    return [x,y]
  }
  const directionref = useRef([0, 1]);
  const foodref = useRef(food())

  
  useEffect(() => {
    const interval = setInterval(() => {
      setBody((prev) => {
        const snakeBody = prev.map((arr) => [...arr]);
        
        const snakeHead = [
            prev[0][0] + directionref.current[0],
            prev[0][1] + directionref.current[1],
        ];
        
        if (
            snakeHead[0] < 0 ||
            snakeHead[0] >= size ||
            snakeHead[1] < 0 ||
            snakeHead[1] >= size ||
            prev.some(([x,y])=>{
                return snakeHead[0]===x && snakeHead[1]===y
            })
        ) {
            setHighScore(score>=highScore?score:highScore)
            localStorage.setItem("gameScore",JSON.stringify(highScore))
            alert("Game Over!!!")
            setScore(0)
            setSpeed(200)
            directionref.current = [1,0]
            return [
                [4, 5]
            ];
        }

        if(snakeHead[0]===foodref.current[0] && snakeHead[1] === foodref.current[1]){
            foodref.current = food()
            setScore((s)=> s+1)
            setSpeed((a)=> a-15)
        }else{
            snakeBody.pop()
        }
        snakeBody.unshift(snakeHead);
        return snakeBody;
      });

    }, speed);
    const direction = (e) => {
      const key = e.key;
      if (key === "ArrowUp" && directionref.current[1] != 1) {
        directionref.current = [0, -1];
      } else if (key === "ArrowDown" && directionref.current[1] != -1) {
        directionref.current = [0, 1];
      } else if (key === "ArrowLeft" && directionref.current[0] != 1) {
        directionref.current = [-1, 0];
      } else if (key === "ArrowRight" && directionref.current[0] != -1) {
        directionref.current = [1, 0];
      }
    };
    window.addEventListener("keydown", direction);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", direction);
    };
  }, [score, highScore]);
  

  return (
    <div className="w-full h-screen overflow-hidden">
      <h1 className="text-center text-3xl text-lime-400 mt-10 tracking-tight">
        Classic Snake Game
      </h1>
      <div className="flex items-center justify-between text-white w-[30rem] mx-auto mt-6">
        <h3>Your Score: {score}</h3>
        <h3>High Score: {highScore}</h3>
      </div>
      <div className="w-[30rem] h-[30rem] bg-gray-400 mx-auto mt-2 grid grid-cols-25">
        {gameSize.map((row, yc) => {
          return row.map((col, xc) => {
            return (
              <div key={`${yc}-${xc}`}
                className={`${isBody(xc, yc) ? "bg-blue-500 rounded-sm" : ""} 
                ${foodref.current[0]===xc && foodref.current[1]===yc ? "bg-orange-600 rounded-full" :""}`}
              ></div>
            );
          });
        })}
      </div>
    </div>
  );
}
