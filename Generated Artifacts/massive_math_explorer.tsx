import React, { useState, useEffect, useRef } from 'react';
import { Play, Zap, Brain, Target, AlertTriangle, RotateCcw, Activity, TrendingUp } from 'lucide-react';

const MassiveMathExplorer = () => {
  const [facts, setFacts] = useState(new Set());
  const [explorationLog, setExplorationLog] = useState([]);
  const [convergenceMetrics, setConvergenceMetrics] = useState({
    totalFacts: 0,
    contradictions: 0,
    newDiscoveries: 0,
    explorationRounds: 0,
    convergenceRate: 0
  });
  const [isExploring, setIsExploring] = useState(false);
  const [explorationProgress, setExplorationProgress] = useState(0);
  const [discoveredPatterns, setDiscoveredPatterns] = useState([]);
  const [breakagePoints, setBreakagePoints] = useState([]);
  const intervalRef = useRef(null);
  
  // Massive domain spaces to explore
  const explorationDomains = {
    integers: Array.from({length: 50}, (_, i) => i - 25), // -25 to 24
    rationals: [], // Will generate dynamically
    matrices: [], // Will generate 2x2 matrices
    polynomials: [], // Will generate simple polynomials
    permutations: [], // Will generate permutation groups
    modularArithmetic: [] // Will explore different moduli
  };

  // Initialize exploration domains
  useEffect(() => {
    initializeExplorationDomains();
  }, []);

  const initializeExplorationDomains = () => {
    // Generate rational numbers
    const rationals = [];
    for (let num = -10; num <= 10; num++) {
      for (let den = 1; den <= 10; den++) {
        if (gcd(Math.abs(num), den) === 1) { // Reduced form only
          rationals.push({ num, den, value: num / den });
        }
      }
    }
    explorationDomains.rationals = rationals;

    // Generate 2x2 matrices
    const matrices = [];
    for (let a = -2; a <= 2; a++) {
      for (let b = -2; b <= 2; b++) {
        for (let c = -2; c <= 2; c++) {
          for (let d = -2; d <= 2; d++) {
            matrices.push([[a, b], [c, d]]);
          }
        }
      }
    }
    explorationDomains.matrices = matrices.slice(0, 100); // Limit for performance

    // Generate simple polynomials (ax^2 + bx + c)
    const polynomials = [];
    for (let a = -3; a <= 3; a++) {
      for (let b = -3; b <= 3; b++) {
        for (let c = -3; c <= 3; c++) {
          polynomials.push({ a, b, c, toString: () => `${a}x² + ${b}x + ${c}` });
        }
      }
    }
    explorationDomains.polynomials = polynomials;

    // Generate permutations of [1,2,3,4]
    const permutations = [];
    const base = [1, 2, 3, 4];
    generatePermutations(base, 0, permutations);
    explorationDomains.permutations = permutations;

    // Modular arithmetic for different moduli
    for (let mod = 2; mod <= 12; mod++) {
      explorationDomains.modularArithmetic.push({
        modulus: mod,
        elements: Array.from({length: mod}, (_, i) => i)
      });
    }
  };

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

  const generatePermutations = (arr, start, result) => {
    if (start === arr.length - 1) {
      result.push([...arr]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      generatePermutations(arr, start + 1, result);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  };

  const addFact = (subject, relation, object, domain, evidence = [], confidence = 1.0) => {
    const fact = `${subject}|${relation}|${object}`;
    const isNew = !facts.has(fact);
    
    if (isNew) {
      setFacts(prev => new Set([...prev, fact]));
      setExplorationLog(prev => [...prev, {
        fact: `${subject} ${relation} ${object}`,
        domain,
        evidence: evidence.slice(0, 3), // Limit evidence for performance
        confidence,
        timestamp: Date.now(),
        isNew: true
      }]);
      
      // Update convergence metrics
      setConvergenceMetrics(prev => ({
        ...prev,
        totalFacts: prev.totalFacts + 1,
        newDiscoveries: prev.newDiscoveries + 1
      }));
    }
    
    return isNew;
  };

  const queryFact = (subject, relation, object) => {
    const fact = `${subject}|${relation}|${object}`;
    return facts.has(fact);
  };

  const massiveIntegerExploration = () => {
    console.log("🔢 MASSIVE Integer Structure Exploration...");
    const integers = explorationDomains.integers;
    let newFacts = 0;

    // Exhaustive addition exploration
    integers.forEach(a => {
      integers.forEach(b => {
        const sum = a + b;
        if (Math.abs(sum) < 100) { // Keep results manageable
          if (addFact(`ADD(${a},${b})`, "EQUALS", sum, "integers", [`computed: ${a} + ${b}`])) {
            newFacts++;
          }
          
          // Commutativity check
          if (addFact(`ADD(${b},${a})`, "EQUALS", sum, "integers", [`commutativity`])) {
            newFacts++;
          }
          
          // Associativity patterns (sample)
          if (Math.abs(a) < 5 && Math.abs(b) < 5) {
            integers.slice(0, 10).forEach(c => {
              const left = (a + b) + c;
              const right = a + (b + c);
              if (left === right) {
                addFact(`ASSOC(${a},${b},${c})`, "HOLDS", "TRUE", "integers", [`${left} = ${right}`]);
              }
            });
          }
        }
      });
    });

    // Multiplication exploration
    integers.slice(0, 20).forEach(a => {
      integers.slice(0, 20).forEach(b => {
        const product = a * b;
        if (Math.abs(product) < 1000) {
          addFact(`MUL(${a},${b})`, "EQUALS", product, "integers", [`computed: ${a} * ${b}`]);
          
          // Zero property
          if (a === 0 || b === 0) {
            addFact(`ZERO_PROPERTY`, "APPLIES", `MUL(${a},${b})`, "integers", [`any * 0 = 0`]);
          }
          
          // Distributivity samples
          integers.slice(0, 5).forEach(c => {
            const left = a * (b + c);
            const right = (a * b) + (a * c);
            if (left === right && Math.abs(left) < 100) {
              addFact(`DIST(${a},${b},${c})`, "HOLDS", "TRUE", "integers", [`${left} = ${right}`]);
            }
          });
        }
      });
    });

    return newFacts;
  };

  const massiveRationalExploration = () => {
    console.log("🧮 MASSIVE Rational Number Exploration...");
    const rationals = explorationDomains.rationals.slice(0, 50); // Limit for performance
    let newFacts = 0;

    rationals.forEach(r1 => {
      rationals.forEach(r2 => {
        // Addition
        const sumNum = r1.num * r2.den + r2.num * r1.den;
        const sumDen = r1.den * r2.den;
        const gcdSum = gcd(Math.abs(sumNum), sumDen);
        const reducedSumNum = sumNum / gcdSum;
        const reducedSumDen = sumDen / gcdSum;
        
        if (addFact(`ADD_RAT(${r1.num}/${r1.den},${r2.num}/${r2.den})`, "EQUALS", 
                   `${reducedSumNum}/${reducedSumDen}`, "rationals", 
                   [`fraction addition`])) {
          newFacts++;
        }

        // Multiplication
        const prodNum = r1.num * r2.num;
        const prodDen = r1.den * r2.den;
        const gcdProd = gcd(Math.abs(prodNum), prodDen);
        const reducedProdNum = prodNum / gcdProd;
        const reducedProdDen = prodDen / gcdProd;
        
        if (addFact(`MUL_RAT(${r1.num}/${r1.den},${r2.num}/${r2.den})`, "EQUALS",
                   `${reducedProdNum}/${reducedProdDen}`, "rationals",
                   [`fraction multiplication`])) {
          newFacts++;
        }

        // Inverse exploration
        if (r1.num !== 0) {
          const invNum = r1.den * (r1.num < 0 ? -1 : 1);
          const invDen = Math.abs(r1.num);
          addFact(`INV_RAT(${r1.num}/${r1.den})`, "EQUALS", `${invNum}/${invDen}`, "rationals", [`multiplicative inverse`]);
        }
      });
    });

    return newFacts;
  };

  const massiveMatrixExploration = () => {
    console.log("📊 MASSIVE Matrix Structure Exploration...");
    const matrices = explorationDomains.matrices.slice(0, 20); // Limit for performance
    let newFacts = 0;

    matrices.forEach((m1, i) => {
      matrices.slice(0, 10).forEach((m2, j) => {
        // Matrix addition
        const sum = [
          [m1[0][0] + m2[0][0], m1[0][1] + m2[0][1]],
          [m1[1][0] + m2[1][0], m1[1][1] + m2[1][1]]
        ];
        
        if (addFact(`MAT_ADD(M${i},M${j})`, "EQUALS", `MAT${JSON.stringify(sum)}`, "matrices", [`matrix addition`])) {
          newFacts++;
        }

        // Matrix multiplication
        const prod = [
          [m1[0][0]*m2[0][0] + m1[0][1]*m2[1][0], m1[0][0]*m2[0][1] + m1[0][1]*m2[1][1]],
          [m1[1][0]*m2[0][0] + m1[1][1]*m2[1][0], m1[1][0]*m2[0][1] + m1[1][1]*m2[1][1]]
        ];
        
        addFact(`MAT_MUL(M${i},M${j})`, "EQUALS", `MAT${JSON.stringify(prod)}`, "matrices", [`matrix multiplication`]);

        // Determinant
        const det1 = m1[0][0] * m1[1][1] - m1[0][1] * m1[1][0];
        addFact(`DET(M${i})`, "EQUALS", det1, "matrices", [`determinant calculation`]);

        // Invertibility check
        if (det1 !== 0) {
          addFact(`M${i}`, "IS_INVERTIBLE", "TRUE", "matrices", [`det ≠ 0`]);
        } else {
          addFact(`M${i}`, "IS_SINGULAR", "TRUE", "matrices", [`det = 0`]);
        }
      });
    });

    return newFacts;
  };

  const massiveModularExploration = () => {
    console.log("🔄 MASSIVE Modular Arithmetic Exploration...");
    let newFacts = 0;

    explorationDomains.modularArithmetic.forEach(modSystem => {
      const { modulus, elements } = modSystem;
      
      // Explore all operations in this modular system
      elements.forEach(a => {
        elements.forEach(b => {
          // Addition mod n
          const sumMod = (a + b) % modulus;
          if (addFact(`ADD_MOD${modulus}(${a},${b})`, "EQUALS", sumMod, `mod${modulus}`, [`modular addition`])) {
            newFacts++;
          }

          // Multiplication mod n
          const prodMod = (a * b) % modulus;
          addFact(`MUL_MOD${modulus}(${a},${b})`, "EQUALS", prodMod, `mod${modulus}`, [`modular multiplication`]);

          // Check for multiplicative inverses
          if (a !== 0 && gcd(a, modulus) === 1) {
            for (let inv = 1; inv < modulus; inv++) {
              if ((a * inv) % modulus === 1) {
                addFact(`INV_MOD${modulus}(${a})`, "EQUALS", inv, `mod${modulus}`, [`modular inverse`]);
                break;
              }
            }
          }
        });
      });

      // Check if this forms a field (for prime moduli)
      const isPrime = modulus > 1 && Array.from({length: modulus-2}, (_, i) => i + 2).every(i => modulus % i !== 0);
      if (isPrime) {
        addFact(`MOD${modulus}`, "IS_FIELD", "TRUE", `mod${modulus}`, [`prime modulus`]);
      }
    });

    return newFacts;
  };

  const massivePermutationExploration = () => {
    console.log("🔀 MASSIVE Permutation Group Exploration...");
    const perms = explorationDomains.permutations.slice(0, 24); // All permutations of 4 elements
    let newFacts = 0;

    perms.forEach((p1, i) => {
      perms.slice(0, 12).forEach((p2, j) => {
        // Composition of permutations
        const composition = p1.map(val => p2[val - 1]);
        if (addFact(`COMP_PERM(P${i},P${j})`, "EQUALS", `P${JSON.stringify(composition)}`, "permutations", [`composition`])) {
          newFacts++;
        }

        // Check for inverse
        const identity = [1, 2, 3, 4];
        const inverse = new Array(4);
        p1.forEach((val, idx) => {
          inverse[val - 1] = idx + 1;
        });
        
        const isInverse = composition.every((val, idx) => val === identity[idx]);
        if (isInverse) {
          addFact(`INV_PERM(P${i})`, "EQUALS", `P${JSON.stringify(inverse)}`, "permutations", [`permutation inverse`]);
        }
      });

      // Cycle structure analysis
      const cycles = findCycles(p1);
      addFact(`CYCLE_STRUCT(P${i})`, "EQUALS", JSON.stringify(cycles), "permutations", [`cycle decomposition`]);
    });

    return newFacts;
  };

  const findCycles = (perm) => {
    const visited = new Array(perm.length).fill(false);
    const cycles = [];
    
    for (let i = 0; i < perm.length; i++) {
      if (!visited[i]) {
        const cycle = [];
        let current = i;
        
        while (!visited[current]) {
          visited[current] = true;
          cycle.push(current + 1);
          current = perm[current] - 1;
        }
        
        if (cycle.length > 1) {
          cycles.push(cycle);
        }
      }
    }
    
    return cycles;
  };

  const detectContradictions = () => {
    console.log("🔍 MASSIVE Contradiction Detection...");
    const contradictions = [];
    
    // Sample contradiction checks (would be much more extensive)
    const sampleFacts = Array.from(facts).slice(0, 100);
    
    sampleFacts.forEach(fact1 => {
      sampleFacts.forEach(fact2 => {
        if (fact1 !== fact2 && doFactsContradict(fact1, fact2)) {
          contradictions.push({
            fact1,
            fact2,
            reason: "Direct contradiction",
            timestamp: Date.now()
          });
        }
      });
    });

    setConvergenceMetrics(prev => ({
      ...prev,
      contradictions: contradictions.length
    }));

    return contradictions;
  };

  const doFactsContradict = (fact1, fact2) => {
    // Simple contradiction detection
    const [s1, r1, o1] = fact1.split('|');
    const [s2, r2, o2] = fact2.split('|');
    
    // Same subject and relation but different objects
    return s1 === s2 && r1 === r2 && o1 !== o2;
  };

  const runMassiveExploration = () => {
    if (isExploring) return;
    
    setIsExploring(true);
    setExplorationProgress(0);
    setFacts(new Set());
    setExplorationLog([]);
    setConvergenceMetrics({
      totalFacts: 0,
      contradictions: 0,
      newDiscoveries: 0,
      explorationRounds: 0,
      convergenceRate: 0
    });

    const explorationRounds = 10;
    let currentRound = 0;

    intervalRef.current = setInterval(() => {
      const startFacts = facts.size;
      
      // Run all exploration types in parallel
      const newIntegerFacts = massiveIntegerExploration();
      const newRationalFacts = massiveRationalExploration();
      const newMatrixFacts = massiveMatrixExploration();
      const newModularFacts = massiveModularExploration();
      const newPermutationFacts = massivePermutationExploration();
      
      const totalNewFacts = newIntegerFacts + newRationalFacts + newMatrixFacts + newModularFacts + newPermutationFacts;
      const endFacts = facts.size;
      const convergenceRate = totalNewFacts / (endFacts || 1);
      
      // Detect contradictions
      const contradictions = detectContradictions();
      
      setConvergenceMetrics(prev => ({
        ...prev,
        explorationRounds: currentRound + 1,
        convergenceRate: convergenceRate,
        contradictions: contradictions.length
      }));
      
      currentRound++;
      setExplorationProgress((currentRound / explorationRounds) * 100);
      
      console.log(`Round ${currentRound}: Added ${totalNewFacts} new facts, total: ${endFacts}, convergence: ${convergenceRate.toFixed(4)}`);
      
      if (currentRound >= explorationRounds || convergenceRate < 0.001) {
        clearInterval(intervalRef.current);
        setIsExploring(false);
        setExplorationProgress(100);
        console.log("🎯 Massive exploration complete!");
      }
    }, 1000);
  };

  const stopExploration = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsExploring(false);
    }
  };

  const resetExploration = () => {
    stopExploration();
    setFacts(new Set());
    setExplorationLog([]);
    setExplorationProgress(0);
    setConvergenceMetrics({
      totalFacts: 0,
      contradictions: 0,
      newDiscoveries: 0,
      explorationRounds: 0,
      convergenceRate: 0
    });
  };

  const recentLog = explorationLog.slice(-50);

  return (
    <div className="min-h-screen bg-black text-green-400 p-6 font-mono">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🌌 Massive Mathematical Knowledge Explorer
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="bg-gray-900 border border-green-500 p-4 rounded">
            <h2 className="text-xl mb-4">🎮 Exploration Control</h2>
            
            <div className="space-y-3">
              <button 
                onClick={runMassiveExploration}
                disabled={isExploring}
                className={`w-full p-3 rounded flex items-center justify-center gap-2 ${
                  isExploring 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-purple-900 hover:bg-purple-800 border border-purple-500'
                }`}
              >
                <Brain size={16} /> {isExploring ? 'Exploring...' : 'Start Massive Exploration'}
              </button>
              
              {isExploring && (
                <button 
                  onClick={stopExploration}
                  className="w-full bg-red-900 hover:bg-red-800 border border-red-500 p-3 rounded flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={16} /> Stop Exploration
                </button>
              )}
              
              <button 
                onClick={resetExploration}
                className="w-full bg-yellow-900 hover:bg-yellow-800 border border-yellow-500 p-3 rounded flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Reset All
              </button>
            </div>
            
            {/* Progress */}
            <div className="mt-6">
              <h3 className="text-lg mb-2">📊 Progress</h3>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${explorationProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400">{explorationProgress.toFixed(1)}% Complete</div>
            </div>
            
            {/* Metrics */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Facts:</span>
                <span className="text-yellow-400">{convergenceMetrics.totalFacts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>New Discoveries:</span>
                <span className="text-green-400">{convergenceMetrics.newDiscoveries.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Rounds:</span>
                <span className="text-blue-400">{convergenceMetrics.explorationRounds}</span>
              </div>
              <div className="flex justify-between">
                <span>Convergence Rate:</span>
                <span className="text-purple-400">{convergenceMetrics.convergenceRate.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Contradictions:</span>
                <span className="text-red-400">{convergenceMetrics.contradictions}</span>
              </div>
            </div>
          </div>
          
          {/* Exploration Domains */}
          <div className="bg-gray-900 border border-green-500 p-4 rounded">
            <h2 className="text-xl mb-4">🏗️ Exploration Domains</h2>
            <div className="space-y-3 text-sm">
              <div className="p-2 bg-gray-800 rounded">
                <div className="font-bold text-blue-400">Integers</div>
                <div className="text-xs text-gray-400">
                  Range: -25 to 24 ({explorationDomains.integers.length} elements)
                </div>
              </div>
              
              <div className="p-2 bg-gray-800 rounded">
                <div className="font-bold text-green-400">Rationals</div>
                <div className="text-xs text-gray-400">
                  Fractions: {explorationDomains.rationals.length} reduced forms
                </div>
              </div>
              
              <div className="p-2 bg-gray-800 rounded">
                <div className="font-bold text-purple-400">Matrices</div>
                <div className="text-xs text-gray-400">
                  2×2 Integer: {explorationDomains.matrices.length} matrices
                </div>
              </div>
              
              <div className="p-2 bg-gray-800 rounded">
                <div className="font-bold text-yellow-400">Permutations</div>
                <div className="text-xs text-gray-400">
                  S₄ Group: {explorationDomains.permutations.length} permutations
                </div>
              </div>
              
              <div className="p-2 bg-gray-800 rounded">
                <div className="font-bold text-red-400">Modular</div>
                <div className="text-xs text-gray-400">
                  Moduli 2-12: {explorationDomains.modularArithmetic.length} systems
                </div>
              </div>
            </div>
          </div>
          
          {/* Real-time Log */}
          <div className="bg-gray-900 border border-green-500 p-4 rounded">
            <h2 className="text-xl mb-4">📜 Live Discovery Log</h2>
            <div className="h-96 overflow-y-auto space-y-1 text-xs">
              {recentLog.map((entry, i) => (
                <div 
                  key={i}
                  className={`p-1 rounded ${entry.isNew ? 'bg-green-900' : 'bg-gray-800'}`}
                >
                  <div className="text-green-400 font-mono">{entry.fact}</div>
                  <div className="text-gray-400">
                    {entry.domain} | conf: {entry.confidence.toFixed(2)}
                  </div>
                  {entry.evidence.length > 0 && (
                    <div className="text-gray-500 text-xs">
                      Evidence: {entry.evidence.join(', ')}
                    </div>
                  )}
                </div>
              ))}
              {recentLog.length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  No discoveries yet. Start exploration to see real-time facts!
                </div>
              )}
            </div>
          </div>
          
          {/* Convergence Analysis */}
          <div className="bg-gray-900 border border-green-500 p-4 rounded">
            <h2 className="text-xl mb-4">📈 Convergence Analysis</h2>
            
            <div className="space-y-4">
              {/* Knowledge Density */}
              <div className="p-3 bg-green-900 rounded">
                <div className="font-bold text-green-400">Knowledge Density</div>
                <div className="text-sm">
                  Facts per domain: {(convergenceMetrics.totalFacts / 5).toFixed(0)}
                </div>
                <div className="text-xs text-gray-400">
                  Higher density → Better pattern recognition
                </div>
              </div>
              
              {/* Exploration Frequency */}
              <div className="p-3 bg-blue-900 rounded">
                <div className="font-bold text-blue-400">Exploration Frequency</div>
                <div className="text-sm">
                  {convergenceMetrics.explorationRounds > 0 
                    ? `${(convergenceMetrics.totalFacts / convergenceMetrics.explorationRounds).toFixed(0)} facts/round`
                    : '0 facts/round'
                  }
                </div>
                <div className="text-xs text-gray-400">
                  Higher frequency → Faster convergence
                </div>
              </div>
              
              {/* Contradiction Rate */}
              <div className="p-3 bg-red-900 rounded">
                <div className="font-bold text-red-400">Error Detection</div>
                <div className="text-sm">
                  {convergenceMetrics.contradictions} contradictions found
                </div>
                <div className="text-xs text-gray-400">
                  More testing → Better validation
                </div>
              </div>
              
              {/* Pattern Emergence */}
              <div className="p-3 bg-purple-900 rounded">
                <div className="font-bold text-purple-400">Pattern Emergence</div>
                <div className="text-sm">
                  Convergence: {(convergenceMetrics.convergenceRate * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-gray-400">
                  Lower rate → Approaching completeness
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Theory Validation */}
        <div className="mt-6 bg-gray-900 border border-yellow-500 p-4 rounded">
          <h2 className="text-xl mb-2 text-yellow-400">🧠 Knowledge Graph Scaling Theory</h2>
          <div className="text-sm text-gray-300 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <strong>Knowledge Density Effect:</strong> More facts → Better pattern recognition. 
              System discovers algebraic structures faster with dense exploration.
            </div>
            <div>
              <strong>Iteration Frequency:</strong> Rapid exploration cycles → Faster convergence. 
              Mathematical truth emerges through exhaustive systematic checking.
            </div>
            <div>
              <strong>Breakage Testing:</strong> Attempting to break structures → Either adds knowledge or detects contradictions. 
              Both outcomes strengthen the knowledge graph.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MassiveMathExplorer;