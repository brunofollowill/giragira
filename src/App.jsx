import React, { useState, useRef } from "react";

const App = () => {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(100);
  const [results, setResults] = useState({
    ball1: null,
    ball2: null,
    ball3: null,
  });
  const [spinning, setSpinning] = useState(false);
  const wheelRefs = useRef([null, null, null]);
  const [history, setHistory] = useState([]);
  const [lastResult, setLastResult] = useState("000"); // Inicialmente mostrando '000'

  const handleBetAmountChange = (event) => {
    const amount = parseInt(event.target.value, 10);
    if (!isNaN(amount) && amount > 0) {
      setBetAmount(amount);
    }
  };

  const handleSpin = () => {
    if (balance >= betAmount && !spinning) {
      const balls = [1, 2, 3];

      setSpinning(true);
      setResults({ ball1: null, ball2: null, ball3: null });

      balls.forEach((ball) => {
        const degrees = 360 * 5 + Math.floor(Math.random() * 360); // Gira 5 vezes e adiciona um ângulo aleatório

        // Gira a bola imediatamente
        wheelRefs.current[ball - 1].style.transition = "transform 3s ease-out";
        wheelRefs.current[ball - 1].style.transform = `rotate(${degrees}deg)`;

        setTimeout(() => {
          const segmentAngle = 360 / 12; // Número de segmentos na roleta
          const segmentIndex = 12 - Math.floor((degrees % 360) / segmentAngle);

          // Simula um resultado baseado no segmento
          const result = Math.random() < 0.5 ? "heads" : "tails";
          setResults((prevResults) => ({
            ...prevResults,
            [`ball${ball}`]: result,
          }));

          // Calcula o ganho ou perda aleatórios, com valores extremos
          let winAmount = 0;
          if (result === "heads") {
            const randomMultiplier = Math.random() * 49 + 1; // Gera um multiplicador aleatório entre 1 e 50
            winAmount = Math.ceil(betAmount * randomMultiplier);
          } else {
            winAmount = -balance; // Perda total do saldo atual
          }

          // Finaliza a animação da bola
          if (ball === 3) {
            setSpinning(false);

            // Mostra os resultados
            setBalance((prevBalance) => prevBalance + winAmount);
            setLastResult(winAmount.toString().padStart(3, "0")); // Atualiza o resultado para exibir o valor ganho ou perdido

            // Atualiza o histórico
            const newHistoryItem = {
              id: Date.now(),
              betAmount: betAmount,
              result: winAmount,
            };
            setHistory((prevHistory) => [newHistoryItem, ...prevHistory]);

            // Reseta as bolas após um curto intervalo
            setTimeout(() => {
              balls.forEach((ball) => {
                wheelRefs.current[ball - 1].style.transition = "none";
                wheelRefs.current[ball - 1].style.transform = "rotate(0deg)";
              });
              setResults({ ball1: null, ball2: null, ball3: null });
            }, 1000);
          }
        }, 3000); // Tempo de espera para o resultado
      });
    } else {
      if (spinning) {
        alert("A roleta está girando. Aguarde o resultado.");
      } else if (balance <= 0) {
        // Caso o saldo seja menor ou igual a zero
        const addMoreBalance = window.confirm(
          "Você perdeu tudo! Deseja adicionar mais saldo?"
        );
        if (addMoreBalance) {
          // Simular a adição de mais saldo (por exemplo, adicionar 1000)
          setBalance((prevBalance) => prevBalance + 1000);
        }
      } else {
        alert(
          "Por favor, insira um valor válido para a aposta ou saldo insuficiente."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-lg p-10 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between gap-8">
          <h1 className="text-3xl font-black text-gray-700 text-center">
            GiraGira
          </h1>

          <div className="p-2 bg-gray-800 text-white rounded-md h-10 flex items-center justify-center">
            <p className="text-center text-lg font-medium">
              Saldo: ${balance}
            </p>
          </div>
        </div>

        <div className="relative w-64 h-64 mx-auto mb-4">
          {["ball1", "ball2", "ball3"].map((ball, index) => (
            <div
              key={index}
              ref={(el) => (wheelRefs.current[index] = el)}
              className="absolute w-1/3 h-1/3 bg-gradient-to-r from-gray-700 to-gray-800 border-4 border-gray-900 rounded-full overflow-hidden shadow-lg"
              style={{
                transform: "rotate(0deg)",
                boxSizing: "border-box",
                left: `${index * 33.33 + 8.33}%`,
                top: "33.33%",
              }}
            >
              <div className="absolute w-1 h-8 bg-gray-600 rounded-full bottom-0 left-1/2 transform -translate-x-1/2"></div>

              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="absolute w-0 h-0 border-2 border-transparent border-t-white border-dashed"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${
                      (index + 1) * (360 / 12)
                    }deg) translate(0, -24px)`,
                    borderTopColor: "white",
                    borderRightColor: "white",
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center mb-4">
          <input
            type="number"
            className="border p-2 mr-2 text-center"
            value={betAmount}
            onChange={handleBetAmountChange}
          />
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none ${
              spinning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSpin}
            disabled={spinning}
          >
            Girar
          </button>
        </div>

        <div className="w-full flex justify-center items-center mb-4">
          <div>
            <p className="text-center text-4xl">${lastResult}</p>
            {balance <= 0 && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mt-2"
                onClick={() => setBalance((prevBalance) => prevBalance + 1000)}
              >
                Adicionar mais saldo
              </button>
            )}
          </div>
        </div>

        <p className="text-center">Faça sua aposta e gire as bolas!</p>
      </div>
    </div>
  );
};

export default App;