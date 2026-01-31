import React, { useState } from 'react';

// ============================================================================
// SIMULADOR DE MIGRAÇÃO DE VAGAS - SISTEMA DE COTAS
// ============================================================================
// Este simulador processa a classificação de candidatos em um sistema de cotas
// com migração de vagas ociosas seguindo regras de prioridade específicas.
// ============================================================================

// Ícones SVG inline (substituindo lucide-react)
const Icons = {
    Users: ({ className }) => React.createElement('svg', {
        className: className || '',
        xmlns: 'http://www.w3.org/2000/svg',
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
        React.createElement('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
        React.createElement('circle', { cx: 9, cy: 7, r: 4 }),
        React.createElement('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
        React.createElement('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
    ),

    Play: ({ className }) => React.createElement('svg', {
        className: className || '',
        xmlns: 'http://www.w3.org/2000/svg',
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2
    },
        React.createElement('polygon', { points: '5 3 19 12 5 21 5 3' })
    ),

    RotateCcw: ({ className }) => React.createElement('svg', {
        className: className || '',
        xmlns: 'http://www.w3.org/2000/svg',
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2
    },
        React.createElement('polyline', { points: '1 4 1 10 7 10' }),
        React.createElement('path', { d: 'M3.51 15a9 9 0 1 0 2.13-9.36L1 10' })
    ),

    ArrowRight: ({ className }) => React.createElement('svg', {
        className: className || '',
        xmlns: 'http://www.w3.org/2000/svg',
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2
    },
        React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 }),
        React.createElement('polyline', { points: '12 5 19 12 12 19' })
    ),

    MoveUp: ({ className }) => React.createElement('svg', {
        className: className || '',
        xmlns: 'http://www.w3.org/2000/svg',
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2
    },
        React.createElement('polyline', { points: '18 15 12 9 6 15' })
    ),

    ChevronRight: ({ className }) => React.createElement('svg', {
        className: className || '',
        xmlns: 'http://www.w3.org/2000/svg',
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2
    },
        React.createElement('polyline', { points: '9 18 15 12 9 6' })
    )
};

const { Users, Play, RotateCcw, ArrowRight, MoveUp, ChevronRight } = Icons;

const QuotaMigrationSimulator = () => {
    // ============================================================================
    // CONFIGURAÇÕES POR ANO
    // ============================================================================

    // ====== CONFIGURAÇÃO 2024 ======
    const config2024 = {
        quotas: [
            { code: 'AC', name: 'Ampla Concorrência', priority: 1, vagas: 10 },
            { code: 'IFPR-PPI', name: 'IFPR - Preto/Pardo/Indígena', priority: 2, vagas: 3 },
            { code: 'IFPR-PCD', name: 'IFPR - PCD', priority: 3, vagas: 2 },
            { code: 'EP', name: 'Escola Pública', priority: 4, vagas: 5 },
            { code: 'EP-PCD', name: 'Escola Pública - PCD', priority: 5, vagas: 2 },
            { code: 'EP-Q', name: 'Escola Pública - Quilombola', priority: 6, vagas: 0 },
            { code: 'EP-PPI', name: 'Escola Pública - Preto/Pardo/Indígena', priority: 7, vagas: 5 },
            { code: 'BR-EP', name: 'BR - Escola Pública', priority: 8, vagas: 5 },
            { code: 'BR-EP-PCD', name: 'BR - Escola Pública - PCD', priority: 9, vagas: 2 },
            { code: 'BR-EP-Q', name: 'BR - Escola Pública - Quilombola', priority: 10, vagas: 1 },
            { code: 'BR-EP-PPI', name: 'BR - Escola Pública - Preto/Pardo/Indígena', priority: 11, vagas: 5 }
        ],
        migrationMap: {
            'AC': [],
            'IFPR-PCD': ['IFPR-PPI', 'BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP-PCD', 'EP', 'AC'],
            'IFPR-PPI': ['IFPR-PCD', 'BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP-PCD', 'EP', 'AC'],
            'BR-EP-PPI': ['BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP-PCD', 'EP', 'AC'],
            'BR-EP-Q': ['BR-EP-PPI', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP-PCD', 'EP', 'AC'],
            'BR-EP-PCD': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP-PCD', 'EP', 'AC'],
            'BR-EP': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'EP-PPI', 'EP-Q', 'EP-PCD', 'EP', 'AC'],
            'EP-PPI': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-Q', 'EP-PCD', 'EP', 'AC'],
            'EP-Q': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-PCD', 'EP', 'AC'],
            'EP-PCD': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP', 'AC'],
            'EP': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP-PCD', 'AC']
        },
        presets: [
            { total: 20, vagas: { 'BR-EP-PPI': 3, 'BR-EP-Q': 1, 'BR-EP-PCD': 1, 'BR-EP': 2, 'EP-PPI': 3, 'EP-Q': 0, 'EP-PCD': 1, 'EP': 2, 'IFPR-PPI': 1, 'IFPR-PCD': 1, 'AC': 5 } },
            { total: 22, vagas: { 'BR-EP-PPI': 3, 'BR-EP-Q': 1, 'BR-EP-PCD': 1, 'BR-EP': 2, 'EP-PPI': 3, 'EP-Q': 0, 'EP-PCD': 1, 'EP': 3, 'IFPR-PPI': 2, 'IFPR-PCD': 1, 'AC': 5 } },
            { total: 25, vagas: { 'BR-EP-PPI': 3, 'BR-EP-Q': 1, 'BR-EP-PCD': 1, 'BR-EP': 3, 'EP-PPI': 3, 'EP-Q': 0, 'EP-PCD': 1, 'EP': 3, 'IFPR-PPI': 3, 'IFPR-PCD': 1, 'AC': 6 } },
            { total: 30, vagas: { 'BR-EP-PPI': 4, 'BR-EP-Q': 1, 'BR-EP-PCD': 1, 'BR-EP': 4, 'EP-PPI': 4, 'EP-Q': 0, 'EP-PCD': 1, 'EP': 4, 'IFPR-PPI': 3, 'IFPR-PCD': 1, 'AC': 7 } },
            { total: 35, vagas: { 'BR-EP-PPI': 4, 'BR-EP-Q': 1, 'BR-EP-PCD': 1, 'BR-EP': 5, 'EP-PPI': 4, 'EP-Q': 0, 'EP-PCD': 1, 'EP': 5, 'IFPR-PPI': 3, 'IFPR-PCD': 2, 'AC': 9 } },
            { total: 36, vagas: { 'BR-EP-PPI': 4, 'BR-EP-Q': 1, 'BR-EP-PCD': 1, 'BR-EP': 5, 'EP-PPI': 4, 'EP-Q': 0, 'EP-PCD': 2, 'EP': 5, 'IFPR-PPI': 3, 'IFPR-PCD': 2, 'AC': 9 } },
            { total: 38, vagas: { 'BR-EP-PPI': 4, 'BR-EP-Q': 1, 'BR-EP-PCD': 2, 'BR-EP': 5, 'EP-PPI': 4, 'EP-Q': 0, 'EP-PCD': 2, 'EP': 5, 'IFPR-PPI': 3, 'IFPR-PCD': 2, 'AC': 10 } },
            { total: 40, vagas: { 'BR-EP-PPI': 5, 'BR-EP-Q': 1, 'BR-EP-PCD': 2, 'BR-EP': 5, 'EP-PPI': 5, 'EP-Q': 0, 'EP-PCD': 2, 'EP': 5, 'IFPR-PPI': 3, 'IFPR-PCD': 2, 'AC': 10 } },
            { total: 50, vagas: { 'BR-EP-PPI': 6, 'BR-EP-Q': 1, 'BR-EP-PCD': 2, 'BR-EP': 6, 'EP-PPI': 6, 'EP-Q': 0, 'EP-PCD': 2, 'EP': 7, 'IFPR-PPI': 5, 'IFPR-PCD': 3, 'AC': 12 } },
            { total: 80, vagas: { 'BR-EP-PPI': 9, 'BR-EP-Q': 1, 'BR-EP-PCD': 3, 'BR-EP': 11, 'EP-PPI': 9, 'EP-Q': 0, 'EP-PCD': 3, 'EP': 12, 'IFPR-PPI': 8, 'IFPR-PCD': 4, 'AC': 20 } }
        ]
    };

    // ====== CONFIGURAÇÃO 2025 ======
    const config2025 = {
        quotas: [
            { code: 'AC', name: 'Ampla Concorrência', priority: 1, vagas: 20 },
            { code: 'EP', name: 'Escola Pública', priority: 2, vagas: 12 },
            { code: 'EP-PCD', name: 'Escola Pública - PCD', priority: 3, vagas: 2 },
            { code: 'EP-Q', name: 'Escola Pública - Quilombola', priority: 4, vagas: 0 },
            { code: 'EP-PPI', name: 'Escola Pública - Preto/Pardo/Indígena', priority: 5, vagas: 10 },
            { code: 'BR-EP', name: 'BR - Escola Pública', priority: 6, vagas: 11 },
            { code: 'BR-EP-PCD', name: 'BR - Escola Pública - PCD', priority: 7, vagas: 2 },
            { code: 'BR-EP-Q', name: 'BR - Escola Pública - Quilombola', priority: 8, vagas: 1 },
            { code: 'BR-EP-PPI', name: 'BR - Escola Pública - Preto/Pardo/Indígena', priority: 9, vagas: 10 },
            { code: 'IFPR-PIF', name: 'IFPR - PIF', priority: 10, vagas: 12 }
        ],
        migrationMap: {
            'AC': [],
            'IFPR-PIF': ['AC'],
            'EP': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP-PCD', 'AC'],
            'EP-PCD': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP', 'AC'],
            'EP-Q': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-PCD', 'EP', 'AC'],
            'EP-PPI': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-Q', 'EP-PCD', 'EP', 'AC'],
            'BR-EP': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP-PCD', 'EP-PPI', 'EP-Q', 'EP-PCD', 'EP', 'AC'],
            'BR-EP-PCD': ['BR-EP-PPI', 'BR-EP-Q', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP-PCD', 'EP', 'AC'],
            'BR-EP-Q': ['BR-EP-PPI', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP-PCD', 'EP', 'AC'],
            'BR-EP-PPI': ['BR-EP-Q', 'BR-EP-PCD', 'BR-EP', 'EP-PPI', 'EP-Q', 'EP-PCD', 'EP', 'AC']
        },
        presets: [
            { total: 20, vagas: { 'BR-EP-PPI': 2, 'BR-EP-Q': 1, 'BR-EP-PCD': 1, 'BR-EP': 2, 'EP-PPI': 2, 'EP-Q': 0, 'EP-PCD': 1, 'EP': 3, 'IFPR-PIF': 3, 'AC': 5 } },
            { total: 30, vagas: { 'BR-EP-PPI': 4, 'BR-EP-Q': 1, 'BR-EP-PCD': 1, 'BR-EP': 4, 'EP-PPI': 3, 'EP-Q': 0, 'EP-PCD': 1, 'EP': 4, 'IFPR-PIF': 4, 'AC': 8 } },
            { total: 35, vagas: { 'BR-EP-PPI': 4, 'BR-EP-Q': 1, 'BR-EP-PCD': 1, 'BR-EP': 5, 'EP-PPI': 4, 'EP-Q': 0, 'EP-PCD': 1, 'EP': 5, 'IFPR-PIF': 5, 'AC': 9 } },
            { total: 38, vagas: { 'BR-EP-PPI': 5, 'BR-EP-Q': 1, 'BR-EP-PCD': 1, 'BR-EP': 5, 'EP-PPI': 4, 'EP-Q': 0, 'EP-PCD': 1, 'EP': 6, 'IFPR-PIF': 5, 'AC': 9 } },
            { total: 40, vagas: { 'BR-EP-PPI': 5, 'BR-EP-Q': 1, 'BR-EP-PCD': 1, 'BR-EP': 5, 'EP-PPI': 5, 'EP-Q': 0, 'EP-PCD': 1, 'EP': 6, 'IFPR-PIF': 6, 'AC': 10 } },
            { total: 80, vagas: { 'BR-EP-PPI': 10, 'BR-EP-Q': 1, 'BR-EP-PCD': 2, 'BR-EP': 11, 'EP-PPI': 10, 'EP-Q': 0, 'EP-PCD': 2, 'EP': 12, 'IFPR-PIF': 12, 'AC': 20 } }
        ]
    };

    // ============================================================================
    // ESTADOS DO REACT
    // ============================================================================

    // Seletor de ano/configuração
    const [selectedYear, setSelectedYear] = useState('2024'); // '2024', '2025', ou 'custom'

    // Configuração ativa (muda com selectedYear)
    const getActiveConfig = () => {
        if (selectedYear === '2024') return config2024;
        if (selectedYear === '2025') return config2025;
        return { quotas: quotas, migrationMap: migrationMap, presets: [] }; // custom usa estados locais
    };

    // Configuração das cotas (pode ser modificada pelo usuário em modo custom)
    const [quotas, setQuotas] = useState(config2024.quotas);

    // Mapa de migração (pode ser modificado em modo custom)
    const [migrationMap, setMigrationMap] = useState(config2024.migrationMap);

    // Lista de todos os candidatos carregados do CSV
    const [students, setStudents] = useState([]);

    // Candidatos organizados e ranqueados por cota (para exibição na barra lateral)
    const [rankedStudents, setRankedStudents] = useState([]);

    // Array com todos os passos da simulação (para navegação)
    const [simulationSteps, setSimulationSteps] = useState([]);

    // Índice do passo atual sendo exibido
    const [currentStep, setCurrentStep] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);
    const [finalResult, setFinalResult] = useState(null);

    // Estado para edição do mapa de migração
    const [editingMigration, setEditingMigration] = useState(null); // quota code sendo editada

    // Estado para adicionar nova cota
    const [addingNewQuota, setAddingNewQuota] = useState(false);
    const [newQuotaCode, setNewQuotaCode] = useState('');
    const [newQuotaName, setNewQuotaName] = useState('');

    // Estado para modal de confirmação
    const [confirmDelete, setConfirmDelete] = useState(null); // quota code a ser removida

    // Funções para gerenciar cotas
    const addNewQuota = () => {
        if (!newQuotaCode.trim() || !newQuotaName.trim()) return;

        const code = newQuotaCode.trim().toUpperCase();

        // Verificar se já existe
        if (quotas.some(q => q.code === code)) {
            alert('Código de cota já existe!');
            return;
        }

        // Adicionar nova cota
        const maxPriority = Math.max(...quotas.map(q => q.priority), 0);
        setQuotas(prev => [...prev, {
            code: code,
            name: newQuotaName.trim(),
            priority: maxPriority + 1,
            vagas: 0
        }]);

        // Adicionar no mapa de migração (sem destinos)
        setMigrationMap(prev => ({
            ...prev,
            [code]: []
        }));

        // Limpar campos
        setNewQuotaCode('');
        setNewQuotaName('');
        setAddingNewQuota(false);
    };

    const removeQuota = (quotaCode) => {
        console.log('Tentando remover cota:', quotaCode);

        // Ao invés de confirm, abre modal customizado
        setConfirmDelete(quotaCode);
    };

    const confirmRemoveQuota = () => {
        const quotaCode = confirmDelete;
        console.log('Removendo cota:', quotaCode);

        // Remover da lista de cotas
        setQuotas(prev => {
            const novasCotas = prev.filter(q => q.code !== quotaCode);
            console.log('Cotas antes:', prev.map(q => q.code));
            console.log('Cotas depois:', novasCotas.map(q => q.code));
            return novasCotas;
        });

        // Remover do mapa de migração
        setMigrationMap(prev => {
            const newMap = { ...prev };

            // Remover a entrada da cota
            delete newMap[quotaCode];

            // Remover das listas de destino de outras cotas
            Object.keys(newMap).forEach(key => {
                if (newMap[key]) {
                    newMap[key] = newMap[key].filter(dest => dest !== quotaCode);
                }
            });

            console.log('Mapa de migração atualizado');
            return newMap;
        });

        // Fechar editor se estava editando esta cota
        if (editingMigration === quotaCode) {
            setEditingMigration(null);
        }

        console.log('Cota removida com sucesso!');
        setConfirmDelete(null);
    };

    // Funções para editar mapa de migração
    const addDestination = (quotaCode, destCode) => {
        setMigrationMap(prev => ({
            ...prev,
            [quotaCode]: [...(prev[quotaCode] || []), destCode]
        }));
    };

    const removeDestination = (quotaCode, index) => {
        setMigrationMap(prev => ({
            ...prev,
            [quotaCode]: prev[quotaCode].filter((_, i) => i !== index)
        }));
    };

    const moveDestination = (quotaCode, fromIndex, toIndex) => {
        setMigrationMap(prev => {
            const newDestinations = [...prev[quotaCode]];
            const [moved] = newDestinations.splice(fromIndex, 1);
            newDestinations.splice(toIndex, 0, moved);
            return {
                ...prev,
                [quotaCode]: newDestinations
            };
        });
    };

    const updateQuotaVagas = (code, value) => {
        setQuotas(prev => prev.map(q =>
            q.code === code ? { ...q, vagas: parseInt(value) || 0 } : q
        ));
    };

    const updateQuotaPriority = (code, value) => {
        setQuotas(prev => prev.map(q =>
            q.code === code ? { ...q, priority: parseInt(value) || 0 } : q
        ));
    };

    const applyPreset = (presetTotal) => {
        const activeConfig = getActiveConfig();
        const preset = activeConfig.presets.find(p => p.total === parseInt(presetTotal));
        if (preset) {
            setQuotas(prev => prev.map(q => ({
                ...q,
                vagas: preset.vagas[q.code] || 0
            })));
        }
    };

    // Função para trocar de ano/configuração
    const changeYear = (year) => {
        setSelectedYear(year);

        if (year === '2024') {
            setQuotas(config2024.quotas);
            setMigrationMap(config2024.migrationMap);
        } else if (year === '2025') {
            setQuotas(config2025.quotas);
            setMigrationMap(config2025.migrationMap);
        }
        // Se year === 'custom', mantém os estados atuais

        // Reseta simulação se estiver rodando
        if (isSimulating) {
            reset();
        }
    };

    const parseCSV = (text) => {
        const lines = text.trim().split('\n');
        const studentMap = new Map();

        // Detectar e pular cabeçalho de forma mais robusta
        let startIndex = 0;
        if (lines.length > 0) {
            const firstLine = lines[0].toLowerCase();
            const cabecalhoKeywords = ['inscrição', 'inscricao', 'nome', 'candidato', 'média', 'media', 'nota', 'data', 'nascimento', 'posição', 'posicao', 'status', 'ação', 'acao', 'afirmativa', 'cota'];

            // Se a primeira linha contém palavras típicas de cabeçalho, pula ela
            const temPalavrasDeCabecalho = cabecalhoKeywords.some(keyword => firstLine.includes(keyword));

            // Ou se a coluna de nota (posição 1 ou 2) não é um número, provavelmente é cabeçalho
            const parts = lines[0].split(';');
            const segundaColuna = parts[1]?.trim().replace(',', '.');
            const terceiraColuna = parts[2]?.trim().replace(',', '.');
            const segundaEhNumero = !isNaN(parseFloat(segundaColuna));
            const terceiraEhNumero = !isNaN(parseFloat(terceiraColuna));

            if (temPalavrasDeCabecalho || (!segundaEhNumero && !terceiraEhNumero)) {
                startIndex = 1;
            }
        }

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];
            const parts = line.split(';');

            // Novo formato: Nº Inscrição,Nome do candidato,Média,Data de Nascimento,Posição,Status,Ação Afirmativa
            if (parts.length >= 7) {
                const numInscricao = parts[0].trim(); // Desconsiderado
                const name = parts[1].trim();
                const notaStr = parts[2].trim().replace(',', '.');
                const nota = parseFloat(notaStr) || 0;
                const dataNascimento = parts[3].trim();
                const posicao = parts[4].trim(); // Desconsiderado
                const status = parts[5].trim();
                const acaoAfirmativa = parts[6].trim();

                // Ignorar se status não for CLASSIFICADO
                if (status !== 'CLASSIFICADO') {
                    continue;
                }

                // Extrair cotas da ação afirmativa
                const quotasNaLinha = acaoAfirmativa ? acaoAfirmativa.split(',').map(q => q.trim()).filter(q => q) : [];

                // Se o aluno já existe no mapa, adiciona as cotas
                if (studentMap.has(name)) {
                    const student = studentMap.get(name);
                    quotasNaLinha.forEach(q => {
                        if (!student.quotas.includes(q)) {
                            student.quotas.push(q);
                        }
                    });
                } else {
                    // Senão, cria um novo aluno
                    studentMap.set(name, {
                        id: studentMap.size + 1,
                        name: name,
                        nota: nota,
                        dataNascimento: dataNascimento,
                        quotas: quotasNaLinha
                    });
                }
            }
            // Formato antigo: Nome;Nota;Data;Cotas
            else if (parts.length >= 3) {
                const name = parts[0].trim();
                const notaStr = parts[1].trim().replace(',', '.');
                const nota = parseFloat(notaStr) || 0;
                const dataNascimento = parts[2].trim();

                const quotasStr = parts[3] || '';
                const quotasNaLinha = quotasStr ? quotasStr.split(',').map(q => q.trim()) : [];

                if (studentMap.has(name)) {
                    const student = studentMap.get(name);
                    quotasNaLinha.forEach(q => {
                        if (!student.quotas.includes(q)) {
                            student.quotas.push(q);
                        }
                    });
                } else {
                    studentMap.set(name, {
                        id: studentMap.size + 1,
                        name: name,
                        nota: nota,
                        dataNascimento: dataNascimento,
                        quotas: quotasNaLinha
                    });
                }
            }
        }

        const parsed = Array.from(studentMap.values());
        setStudents(parsed);

        const sortedQuotas = [...quotas].sort((a, b) => a.priority - b.priority);
        const ranking = [];

        sortedQuotas.forEach(quota => {
            const studentsInQuota = parsed
                .filter(s => s.quotas.includes(quota.code))
                .sort((a, b) => {
                    // Primeiro critério: nota (maior primeiro)
                    if (b.nota !== a.nota) {
                        return b.nota - a.nota;
                    }
                    // Segundo critério: data de nascimento (mais velho primeiro)
                    // Converte DD/MM/YYYY para objeto Date
                    const parseDate = (dateStr) => {
                        const [day, month, year] = dateStr.split('/');
                        return new Date(year, month - 1, day);
                    };
                    return parseDate(a.dataNascimento) - parseDate(b.dataNascimento);
                });

            if (studentsInQuota.length > 0) {
                ranking.push({
                    quota: quota.code,
                    students: studentsInQuota
                });
            }
        });

        setRankedStudents(ranking);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                parseCSV(text);
            };
            reader.readAsText(file);
        }
    };

    const runSimulation = () => {
        const steps = [];
        const sortedQuotas = [...quotas].sort((a, b) => a.priority - b.priority);
        const priorityMap = {};
        sortedQuotas.forEach(q => {
            priorityMap[q.code] = q.priority;
        });

        const state = {};
        const classificadosGlobal = new Set();
        const vagasRecebidas = {};

        sortedQuotas.forEach(q => {
            vagasRecebidas[q.code] = [];

            // Criar array de vagas individuais
            const vagasIndividuais = [];
            for (let i = 0; i < q.vagas; i++) {
                vagasIndividuais.push({
                    numero: i + 1,
                    estudante: null,
                    recebidaDe: null, // null = vaga original, string = cota de origem
                    preenchida: false
                });
            }

            state[q.code] = {
                vagas: q.vagas,
                vagasOriginais: q.vagas,
                vagasAtivas: q.vagas,
                classificados: [],
                vagasIndividuais: vagasIndividuais, // Nova estrutura!
                aguardando: students
                    .filter(s => s.quotas.includes(q.code))
                    .sort((a, b) => {
                        // Primeiro critério: nota (maior primeiro)
                        if (b.nota !== a.nota) {
                            return b.nota - a.nota;
                        }
                        // Segundo critério: data de nascimento (mais velho primeiro)
                        const parseDate = (dateStr) => {
                            const [day, month, year] = dateStr.split('/');
                            return new Date(year, month - 1, day);
                        };
                        return parseDate(a.dataNascimento) - parseDate(b.dataNascimento);
                    })
            };
        });

        steps.push({
            type: 'initial',
            description: 'Estado inicial - distribuição de candidatos por cota',
            state: JSON.parse(JSON.stringify(state)),
            classificadosGlobal: new Set(classificadosGlobal),
            vagasRecebidas: JSON.parse(JSON.stringify(vagasRecebidas))
        });

        const processarVaga = (quotaCode, apenasUma = false) => {
            const quotaState = state[quotaCode];

            if (quotaState.vagas <= 0) return;

            // A lista aguardando JÁ está ordenada por nota
            // Percorre a lista na ordem e pega o primeiro elegível
            for (const candidato of quotaState.aguardando) {
                // Verifica se é candidato novo (não classificado)
                if (!classificadosGlobal.has(candidato.id)) {
                    quotaState.classificados.push(candidato);
                    quotaState.vagas -= 1;
                    classificadosGlobal.add(candidato.id);

                    // Preencher a primeira vaga disponível
                    const vagaDisponivel = quotaState.vagasIndividuais.find(v => !v.preenchida);
                    if (vagaDisponivel) {
                        vagaDisponivel.preenchida = true;
                        vagaDisponivel.estudante = candidato.name;
                    }

                    steps.push({
                        type: 'classification',
                        quota: quotaCode,
                        description: `Classificando ${candidato.name} em ${quotaCode}`,
                        classified: [candidato.name],
                        state: JSON.parse(JSON.stringify(state)),
                        classificadosGlobal: new Set(classificadosGlobal),
                        vagasRecebidas: JSON.parse(JSON.stringify(vagasRecebidas))
                    });

                    if (!apenasUma && quotaState.vagas > 0) {
                        processarVaga(quotaCode, apenasUma);
                    }
                    return;
                }

                // Verifica se pode fazer upgrade (já classificado em cota pior)
                let podeUpgrade = false;
                let cotaAnterior = null;

                for (const [code, data] of Object.entries(state)) {
                    if (data.classificados.some(c => c.id === candidato.id)) {
                        const cotaAtualPriority = priorityMap[code];
                        const quotaPriority = priorityMap[quotaCode];
                        if (quotaPriority < cotaAtualPriority) {
                            podeUpgrade = true;
                            cotaAnterior = code;
                        }
                        break;
                    }
                }

                if (podeUpgrade) {
                    // Remove da cota anterior
                    const idx = state[cotaAnterior].classificados.findIndex(c => c.id === candidato.id);
                    state[cotaAnterior].classificados.splice(idx, 1);
                    state[cotaAnterior].vagas += 1;

                    // Libera a vaga antiga no array de vagas individuais
                    const vagaAntiga = state[cotaAnterior].vagasIndividuais.find(v => v.estudante === candidato.name);
                    if (vagaAntiga) {
                        vagaAntiga.preenchida = false;
                        vagaAntiga.estudante = null;
                    }

                    // Adiciona na cota atual
                    quotaState.classificados.push(candidato);
                    quotaState.vagas -= 1;

                    // Preenche a primeira vaga disponível na nova cota
                    const vagaDisponivel = quotaState.vagasIndividuais.find(v => !v.preenchida);
                    if (vagaDisponivel) {
                        vagaDisponivel.preenchida = true;
                        vagaDisponivel.estudante = candidato.name;
                    }

                    steps.push({
                        type: 'upgrade',
                        student: candidato.name,
                        from: cotaAnterior,
                        to: quotaCode,
                        description: `${candidato.name} subiu de ${cotaAnterior} → ${quotaCode}`,
                        state: JSON.parse(JSON.stringify(state)),
                        classificadosGlobal: new Set(classificadosGlobal),
                        vagasRecebidas: JSON.parse(JSON.stringify(vagasRecebidas))
                    });

                    processarVaga(cotaAnterior, true);

                    if (!apenasUma && quotaState.vagas > 0) {
                        processarVaga(quotaCode, apenasUma);
                    }
                    return;
                }
            }

            // Não achou ninguém elegível, migra a vaga
            const migrationSequence = migrationMap[quotaCode] || [];

            for (const targetCode of migrationSequence) {
                if (quotaState.vagas > 0 && state[targetCode]) {
                    const targetState = state[targetCode];

                    const temCandidatoNovo = targetState.aguardando.some(s => !classificadosGlobal.has(s.id));

                    const temCandidatoUpgrade = targetState.aguardando.some(s => {
                        if (!classificadosGlobal.has(s.id)) return false;

                        for (const [code, data] of Object.entries(state)) {
                            if (data.classificados.some(c => c.id === s.id)) {
                                const cotaAtualPriority = priorityMap[code];
                                const targetPriority = priorityMap[targetCode];
                                return targetPriority < cotaAtualPriority;
                            }
                        }
                        return false;
                    });

                    if (temCandidatoNovo || temCandidatoUpgrade) {
                        // Remove a vaga da origem
                        quotaState.vagasAtivas -= 1;
                        quotaState.vagas -= 1;

                        // Priorizar remover vaga RECEBIDA vazia, senão remove vaga original vazia
                        let vagaParaRemover = quotaState.vagasIndividuais.find(v => !v.preenchida && v.recebidaDe !== null);

                        // Se não encontrou vaga recebida vazia, pega qualquer vaga vazia
                        if (!vagaParaRemover) {
                            vagaParaRemover = quotaState.vagasIndividuais.reverse().find(v => !v.preenchida);
                            quotaState.vagasIndividuais.reverse(); // Volta à ordem normal
                        }

                        if (vagaParaRemover) {
                            const idx = quotaState.vagasIndividuais.indexOf(vagaParaRemover);
                            quotaState.vagasIndividuais.splice(idx, 1);

                            // Se removeu uma vaga recebida, atualizar o registro
                            if (vagaParaRemover.recebidaDe) {
                                const vagasRecebidasOrigem = vagasRecebidas[quotaCode] || [];
                                const idxRecebida = vagasRecebidasOrigem.indexOf(vagaParaRemover.recebidaDe);
                                if (idxRecebida !== -1) {
                                    vagasRecebidasOrigem.splice(idxRecebida, 1);
                                }
                            }
                        }

                        // Adiciona no destino
                        targetState.vagas += 1;
                        targetState.vagasAtivas += 1;
                        vagasRecebidas[targetCode].push(quotaCode);

                        // Encontrar a posição certa: após a última vaga preenchida
                        let posicaoInsercao = targetState.vagasIndividuais.findIndex(v => !v.preenchida);
                        if (posicaoInsercao === -1) {
                            // Todas as vagas estão preenchidas, adiciona no final
                            posicaoInsercao = targetState.vagasIndividuais.length;
                        }

                        // Inserir vaga recebida MARCADA na posição correta
                        targetState.vagasIndividuais.splice(posicaoInsercao, 0, {
                            numero: targetState.vagasIndividuais.length + 1,
                            estudante: null,
                            recebidaDe: quotaCode, // MARCADA como recebida de quotaCode!
                            preenchida: false
                        });

                        steps.push({
                            type: 'migration',
                            from: quotaCode,
                            to: targetCode,
                            vagas: 1,
                            description: `Migrando 1 vaga de ${quotaCode} → ${targetCode}`,
                            state: JSON.parse(JSON.stringify(state)),
                            classificadosGlobal: new Set(classificadosGlobal),
                            vagasRecebidas: JSON.parse(JSON.stringify(vagasRecebidas))
                        });

                        // Processa a vaga que chegou no destino (pode classificar novo OU fazer upgrade)
                        processarVaga(targetCode, true);

                        // Depois de processar o destino, verifica se ainda tem vaga na origem para continuar migrando
                        if (!apenasUma && quotaState.vagas > 0) {
                            processarVaga(quotaCode, apenasUma);
                        }
                        return;
                    }
                }
            }
        };

        sortedQuotas.forEach(quota => {
            processarVaga(quota.code, false);
        });

        const result = {};
        Object.keys(state).forEach(code => {
            result[code] = {
                vagasOriginais: state[code].vagasOriginais,
                vagasAtivas: state[code].vagasAtivas,
                classificados: state[code].classificados.length,
                vagasSobressalentes: state[code].vagas,
                alunos: state[code].classificados.map(s => s.name)
            };
        });

        setFinalResult(result);
        setSimulationSteps(steps);
        setCurrentStep(0);
        setIsSimulating(true);
    };

    const nextStep = () => {
        if (currentStep < simulationSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const reset = () => {
        setIsSimulating(false);
        setSimulationSteps([]);
        setCurrentStep(0);
        setFinalResult(null);
    };

    const currentStepData = simulationSteps[currentStep];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full mx-auto">
                {!isSimulating && (
                    <>
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="w-8 h-8 text-indigo-600" />
                                <h1 className="text-3xl font-bold text-gray-800">
                                    Simulador de Migração de Vagas
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Configure vagas, carregue candidatos e visualize passo a passo
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Configuração de Vagas</h2>

                            {/* SELETOR DE ANO/CONFIGURAÇÃO */}
                            <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-300">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    📅 Selecione a Configuração
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => changeYear('2024')}
                                        className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all ${selectedYear === '2024'
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'bg-white text-indigo-600 border-2 border-indigo-300 hover:bg-indigo-100'
                                            }`}
                                    >
                                        2024
                                    </button>
                                    <button
                                        onClick={() => changeYear('2025')}
                                        className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all ${selectedYear === '2025'
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'bg-white text-indigo-600 border-2 border-indigo-300 hover:bg-indigo-100'
                                            }`}
                                    >
                                        2025
                                    </button>
                                    <button
                                        onClick={() => changeYear('custom')}
                                        className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all ${selectedYear === 'custom'
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'bg-white text-indigo-600 border-2 border-indigo-300 hover:bg-indigo-100'
                                            }`}
                                    >
                                        Personalizado
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    {selectedYear === '2024' && '🔹 Usando configuração de 2024'}
                                    {selectedYear === '2025' && '🔹 Usando configuração de 2025'}
                                    {selectedYear === 'custom' && '🔹 Modo personalizado - edite livremente'}
                                </p>
                            </div>

                            {/* PRESETS DE VAGAS */}
                            {selectedYear !== 'custom' && (
                                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Presets de {selectedYear} (Selecione o total de vagas)
                                    </label>
                                    <select
                                        onChange={(e) => applyPreset(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue=""
                                        key={selectedYear}
                                    >
                                        <option value="" disabled>Selecione uma configuração...</option>
                                        {getActiveConfig().presets.map(preset => (
                                            <option key={preset.total} value={preset.total}>
                                                {preset.total} vagas totais
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-600 mt-2">
                                        Ao selecionar, as vagas de todas as cotas serão preenchidas automaticamente
                                    </p>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-semibold text-gray-700">
                                        Ajuste manual {selectedYear !== 'custom' && <span className="text-gray-500 font-normal">(bloqueado em presets)</span>}
                                    </h3>
                                    {selectedYear === 'custom' && (
                                        <button
                                            onClick={() => setAddingNewQuota(true)}
                                            className="text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold"
                                        >
                                            + Nova Cota
                                        </button>
                                    )}
                                </div>

                                {/* Formulário para adicionar nova cota */}
                                {addingNewQuota && (
                                    <div className="mb-4 p-3 bg-indigo-50 rounded border-2 border-indigo-300">
                                        <div className="flex gap-2 items-end">
                                            <div className="flex-1">
                                                <label className="block text-xs text-gray-700 mb-1">Código</label>
                                                <input
                                                    type="text"
                                                    value={newQuotaCode}
                                                    onChange={(e) => setNewQuotaCode(e.target.value)}
                                                    placeholder="Ex: EP-XYZ"
                                                    className="w-full px-2 py-1 border rounded text-sm"
                                                    onKeyPress={(e) => e.key === 'Enter' && addNewQuota()}
                                                />
                                            </div>
                                            <div className="flex-[2]">
                                                <label className="block text-xs text-gray-700 mb-1">Nome</label>
                                                <input
                                                    type="text"
                                                    value={newQuotaName}
                                                    onChange={(e) => setNewQuotaName(e.target.value)}
                                                    placeholder="Ex: Escola Pública - XYZ"
                                                    className="w-full px-2 py-1 border rounded text-sm"
                                                    onKeyPress={(e) => e.key === 'Enter' && addNewQuota()}
                                                />
                                            </div>
                                            <button
                                                onClick={addNewQuota}
                                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
                                            >
                                                Adicionar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAddingNewQuota(false);
                                                    setNewQuotaCode('');
                                                    setNewQuotaName('');
                                                }}
                                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-6 gap-3">
                                    {quotas.map(quota => (
                                        <div key={quota.code} className={`border rounded p-2 relative group ${selectedYear !== 'custom' ? 'bg-gray-50' : ''}`}>
                                            {selectedYear === 'custom' && (
                                                <button
                                                    onClick={() => removeQuota(quota.code)}
                                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    title="Remover cota"
                                                >
                                                    ×
                                                </button>
                                            )}
                                            <div className="font-semibold text-xs mb-1 text-indigo-600">{quota.code}</div>
                                            <div className="flex gap-1 items-center mb-1">
                                                <label className="text-xs text-gray-600">V:</label>
                                                <input
                                                    type="number"
                                                    value={quota.vagas}
                                                    onChange={(e) => updateQuotaVagas(quota.code, e.target.value)}
                                                    className="w-12 px-1 py-0.5 border rounded text-xs"
                                                    min="0"
                                                    disabled={selectedYear !== 'custom'}
                                                />
                                                <label className="text-xs text-gray-600 ml-1">P:</label>
                                                <input
                                                    type="number"
                                                    value={quota.priority}
                                                    onChange={(e) => updateQuotaPriority(quota.code, e.target.value)}
                                                    className="w-12 px-1 py-0.5 border rounded text-xs"
                                                    min="1"
                                                    disabled={selectedYear !== 'custom'}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* VISUALIZAÇÃO/EDITOR DO MAPA DE MIGRAÇÃO */}
                            <div className="border-t pt-4 mt-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                    📊 Mapa de Migração de Vagas
                                    {selectedYear !== 'custom' && <span className="text-gray-500 font-normal ml-2">(somente leitura)</span>}
                                    {selectedYear === 'custom' && <span className="text-green-600 font-normal ml-2">(editável)</span>}
                                </h3>

                                {selectedYear === 'custom' ? (
                                    /* MODO EDITOR - Personalizado */
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="space-y-1">
                                            {quotas.map(quota => {
                                                const destinations = migrationMap[quota.code] || [];
                                                const availableQuotas = quotas.filter(q =>
                                                    q.code !== quota.code && !destinations.includes(q.code)
                                                );

                                                return (
                                                    <div key={quota.code} className="bg-white rounded p-3 border-2 border-indigo-200">
                                                        <div className="flex items-start gap-2 mb-2">
                                                            <span className="font-semibold text-sm text-indigo-600 min-w-[100px] mt-1">
                                                                {quota.code}
                                                            </span>
                                                            <span className="text-gray-400 text-xs mt-1">→</span>

                                                            <div className="flex-1">
                                                                {/* Lista de destinos (drag and drop) */}
                                                                <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
                                                                    {destinations.length === 0 && !editingMigration && (
                                                                        <span className="text-xs text-gray-400 italic py-1">Sem migração</span>
                                                                    )}

                                                                    {destinations.map((dest, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            draggable
                                                                            onDragStart={(e) => {
                                                                                e.dataTransfer.effectAllowed = 'move';
                                                                                e.dataTransfer.setData('quotaCode', quota.code);
                                                                                e.dataTransfer.setData('fromIndex', idx.toString());
                                                                            }}
                                                                            onDragOver={(e) => {
                                                                                e.preventDefault();
                                                                                e.dataTransfer.dropEffect = 'move';
                                                                            }}
                                                                            onDrop={(e) => {
                                                                                e.preventDefault();
                                                                                const fromQuota = e.dataTransfer.getData('quotaCode');
                                                                                const fromIndex = parseInt(e.dataTransfer.getData('fromIndex'));
                                                                                if (fromQuota === quota.code) {
                                                                                    moveDestination(quota.code, fromIndex, idx);
                                                                                }
                                                                            }}
                                                                            className="group relative text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded border border-blue-300 cursor-move hover:bg-blue-200 transition-all"
                                                                        >
                                                                            <span className="font-semibold text-blue-800">{idx + 1}.</span> {dest}
                                                                            <button
                                                                                onClick={() => removeDestination(quota.code, idx)}
                                                                                className="ml-2 text-red-500 hover:text-red-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                ×
                                                                            </button>
                                                                        </div>
                                                                    ))}

                                                                    {/* Botão + inline ou popup */}
                                                                    {editingMigration === quota.code ? (
                                                                        <div className="flex flex-wrap gap-1 p-2 bg-indigo-50 rounded border border-indigo-200 w-full mt-1">
                                                                            <span className="text-xs text-gray-600 w-full mb-1">Adicionar:</span>
                                                                            {availableQuotas.map(q => (
                                                                                <button
                                                                                    key={q.code}
                                                                                    onClick={() => {
                                                                                        addDestination(quota.code, q.code);
                                                                                        setEditingMigration(null);
                                                                                    }}
                                                                                    className="text-xs px-2 py-1 bg-white border border-indigo-300 rounded hover:bg-indigo-100 text-indigo-700"
                                                                                >
                                                                                    + {q.code}
                                                                                </button>
                                                                            ))}
                                                                            <button
                                                                                onClick={() => setEditingMigration(null)}
                                                                                className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 ml-auto"
                                                                            >
                                                                                ✕
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        availableQuotas.length > 0 && (
                                                                            <button
                                                                                onClick={() => setEditingMigration(quota.code)}
                                                                                className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded border border-green-300 hover:bg-green-200 font-bold"
                                                                                title="Adicionar destino"
                                                                            >
                                                                                +
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3">
                                            💡 <strong>Arraste</strong> as tags para reordenar prioridade. <strong>Clique no X</strong> para remover. <strong>Clique "+ Adicionar"</strong> para incluir novos destinos.
                                        </p>
                                    </div>
                                ) : (
                                    /* MODO VISUALIZAÇÃO - 2024/2025 */
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="space-y-0.5">
                                            {quotas.map(quota => {
                                                const destinations = migrationMap[quota.code] || [];
                                                return (
                                                    <div key={quota.code} className="flex items-center gap-2 py-1">
                                                        <span className="font-semibold text-sm text-indigo-600 min-w-[100px]">{quota.code}</span>
                                                        <span className="text-gray-400 text-xs">→</span>
                                                        <div className="flex-1">
                                                            {destinations.length === 0 ? (
                                                                <span className="text-xs text-gray-400 italic">Sem migração</span>
                                                            ) : (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {destinations.map((dest, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-300"
                                                                        >
                                                                            {idx + 1}. {dest}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3">
                                            💡 Ordem de migração: 1º destino tem maior prioridade. A vaga tenta migrar para cada cota na ordem até encontrar candidatos elegíveis.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Carregar Candidatos (CSV)</h2>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Formatos Aceitos:
                                </label>

                                <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                                    <p className="text-xs font-semibold text-blue-900 mb-1">Formato Completo (7 colunas):</p>
                                    <p className="text-xs text-blue-800 mb-1">Nº Inscrição;Nome do candidato;Média;Data de Nascimento;Posição;Status;Ação Afirmativa</p>
                                    <p className="text-xs text-blue-700 mb-1">Exemplo: 12345;João Silva;85,5;15/03/2005;10;CLASSIFICADO;AC,EP,BR-EP</p>
                                    <p className="text-xs text-blue-600 italic">• Ignora linhas com Status ≠ "CLASSIFICADO"</p>
                                </div>

                                <div className="mb-3 p-3 bg-green-50 rounded border border-green-200">
                                    <p className="text-xs font-semibold text-green-900 mb-1">Formato Simples (4 colunas):</p>
                                    <p className="text-xs text-green-800 mb-1">Nome;Nota;DataNascimento;COTA1,COTA2,COTA3</p>
                                    <p className="text-xs text-green-700">Exemplo: João Silva;85,5;15/03/2005;AC,EP,BR-EP</p>
                                </div>

                                <div className="mb-3 p-3 bg-purple-50 rounded border border-purple-200">
                                    <p className="text-xs font-semibold text-purple-900 mb-1">Formato com Linhas Repetidas:</p>
                                    <p className="text-xs text-purple-800 mb-1">Nome;Nota;DataNascimento;COTA</p>
                                    <p className="text-xs text-purple-700 mb-1">Exemplo:</p>
                                    <p className="text-xs text-purple-700 mb-0.5">João Silva;85,5;15/03/2005;AC</p>
                                    <p className="text-xs text-purple-700">João Silva;85,5;15/03/2005;EP</p>
                                    <p className="text-xs text-purple-600 italic">• Mesmo nome é agrupado automaticamente</p>
                                </div>

                                <p className="text-xs text-gray-500 mt-3">
                                    📅 Data no formato DD/MM/AAAA (desempate: mais velho primeiro)<br />
                                    📄 Primeira linha pode conter cabeçalho (será detectada e ignorada automaticamente)
                                </p>
                                <input
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={handleFileUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>

                            {students.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-semibold mb-2">Candidatos: {students.length}</h3>
                                    <div className="max-h-60 overflow-y-auto bg-gray-50 p-3 rounded">
                                        {students.map(student => (
                                            <div key={student.id} className="text-sm py-1 border-b">
                                                <span className="font-medium">{student.name}</span>
                                                <span className="text-indigo-600 font-semibold mx-2">{student.nota.toFixed(2)}</span>
                                                <span className="text-gray-500 text-xs mx-2">({student.dataNascimento})</span>
                                                <span className="text-gray-600">→ {student.quotas.join(', ')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={runSimulation}
                            disabled={students.length === 0}
                            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            Iniciar Simulação
                        </button>
                    </>
                )}

                {isSimulating && currentStepData && (
                    <div className="flex gap-4">
                        <div className="w-96 lg:w-[25%] xl:w-[28%] 2xl:w-[30%] bg-white rounded-lg shadow-lg p-4 max-h-screen overflow-y-auto">
                            <div className="grid grid-cols-3 gap-2">
                                {/* Primeira coluna - AC */}
                                <div className="space-y-4">
                                    {rankedStudents.filter(({ quota }) => quota === 'AC').map(({ quota, students: quotaStudents }) => {
                                        const quotaPriority = quotas.find(q => q.code === quota)?.priority || 999;

                                        return (
                                            <div key={quota} className="border-b pb-3">
                                                <div className="font-bold text-xs text-indigo-600 mb-2">{quota}</div>
                                                <div className="space-y-1">
                                                    {quotaStudents.map((student, idx) => {
                                                        const isClassified = currentStepData.classificadosGlobal.has(student.id);

                                                        let classifiedPriority = 999;

                                                        if (isClassified) {
                                                            for (const [code, data] of Object.entries(currentStepData.state)) {
                                                                if (data.classificados.some(s => s.id === student.id)) {
                                                                    classifiedPriority = quotas.find(q => q.code === code)?.priority || 999;
                                                                    break;
                                                                }
                                                            }
                                                        }

                                                        const shouldStrike = isClassified && quotaPriority >= classifiedPriority;

                                                        return (
                                                            <div
                                                                key={student.id}
                                                                className={`text-xs flex justify-between ${shouldStrike ? 'opacity-40 line-through' : ''
                                                                    }`}
                                                            >
                                                                <span className="truncate flex-1">{idx + 1}. {student.name}</span>
                                                                <span className="font-semibold ml-2">{student.nota.toFixed(2)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Segunda coluna - EP */}
                                <div className="space-y-4">
                                    {rankedStudents.filter(({ quota }) => quota === 'EP').map(({ quota, students: quotaStudents }) => {
                                        const quotaPriority = quotas.find(q => q.code === quota)?.priority || 999;

                                        return (
                                            <div key={quota} className="border-b pb-3">
                                                <div className="font-bold text-xs text-indigo-600 mb-2">{quota}</div>
                                                <div className="space-y-1">
                                                    {quotaStudents.map((student, idx) => {
                                                        const isClassified = currentStepData.classificadosGlobal.has(student.id);

                                                        let classifiedPriority = 999;

                                                        if (isClassified) {
                                                            for (const [code, data] of Object.entries(currentStepData.state)) {
                                                                if (data.classificados.some(s => s.id === student.id)) {
                                                                    classifiedPriority = quotas.find(q => q.code === code)?.priority || 999;
                                                                    break;
                                                                }
                                                            }
                                                        }

                                                        const shouldStrike = isClassified && quotaPriority >= classifiedPriority;

                                                        return (
                                                            <div
                                                                key={student.id}
                                                                className={`text-xs flex justify-between ${shouldStrike ? 'opacity-40 line-through' : ''
                                                                    }`}
                                                            >
                                                                <span className="truncate flex-1">{idx + 1}. {student.name}</span>
                                                                <span className="font-semibold ml-2">{student.nota.toFixed(2)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Terceira coluna - demais cotas */}
                                <div className="space-y-4">
                                    {rankedStudents.filter(({ quota }) => quota !== 'AC' && quota !== 'EP').map(({ quota, students: quotaStudents }) => {
                                        const quotaPriority = quotas.find(q => q.code === quota)?.priority || 999;

                                        return (
                                            <div key={quota} className="border-b pb-3">
                                                <div className="font-bold text-xs text-indigo-600 mb-2">{quota}</div>
                                                <div className="space-y-1">
                                                    {quotaStudents.map((student, idx) => {
                                                        const isClassified = currentStepData.classificadosGlobal.has(student.id);

                                                        let classifiedPriority = 999;

                                                        if (isClassified) {
                                                            for (const [code, data] of Object.entries(currentStepData.state)) {
                                                                if (data.classificados.some(s => s.id === student.id)) {
                                                                    classifiedPriority = quotas.find(q => q.code === code)?.priority || 999;
                                                                    break;
                                                                }
                                                            }
                                                        }

                                                        const shouldStrike = isClassified && quotaPriority >= classifiedPriority;

                                                        return (
                                                            <div
                                                                key={student.id}
                                                                className={`text-xs flex justify-between ${shouldStrike ? 'opacity-40 line-through' : ''
                                                                    }`}
                                                            >
                                                                <span className="truncate flex-1">{idx + 1}. {student.name}</span>
                                                                <span className="font-semibold ml-2">{student.nota.toFixed(2)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Passo {currentStep + 1} de {simulationSteps.length}
                                    </h2>
                                    <button
                                        onClick={reset}
                                        className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reiniciar
                                    </button>
                                </div>

                                <div className={`p-3 rounded-lg mb-3 text-sm ${currentStepData.type === 'initial' ? 'bg-blue-50 border-l-4 border-blue-500' :
                                    currentStepData.type === 'classification' ? 'bg-green-50 border-l-4 border-green-500' :
                                        currentStepData.type === 'migration' ? 'bg-orange-50 border-l-4 border-orange-500' :
                                            'bg-purple-50 border-l-4 border-purple-500'
                                    }`}>
                                    <p className="font-semibold text-gray-800">{currentStepData.description}</p>
                                    {currentStepData.type === 'migration' && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-1 flex-wrap">
                                                {migrationMap[currentStepData.from]?.map((target, idx) => (
                                                    <React.Fragment key={idx}>
                                                        <span className={`px-2 py-0.5 rounded text-xs ${target === currentStepData.to
                                                            ? 'bg-orange-200 text-orange-800 font-semibold'
                                                            : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {target}
                                                        </span>
                                                        {idx < migrationMap[currentStepData.from].length - 1 && (
                                                            <ArrowRight className="w-3 h-3 text-gray-400" />
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {currentStepData.type === 'upgrade' && (
                                        <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-gray-700">
                                            <MoveUp className="w-4 h-4 text-purple-600" />
                                            <span className="bg-white px-2 py-1 rounded">{currentStepData.from}</span>
                                            <ArrowRight className="w-4 h-4" />
                                            <span className="bg-white px-2 py-1 rounded">{currentStepData.to}</span>
                                        </div>
                                    )}
                                    {currentStepData.type === 'classification' && (
                                        <div className="text-xs text-gray-600 mt-2">
                                            Vagas restantes em {currentStepData.quota}: <span className="font-semibold">{currentStepData.state[currentStepData.quota].vagas}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-base text-gray-800">Vagas</h3>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={prevStep}
                                            disabled={currentStep === 0}
                                            className="bg-gray-600 text-white py-1 px-3 rounded text-xs hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            ← Anterior
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max={simulationSteps.length - 1}
                                                value={currentStep}
                                                onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                                                className="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                            <span className="text-xs text-gray-600 min-w-[60px]">
                                                {currentStep + 1}/{simulationSteps.length}
                                            </span>
                                        </div>
                                        <button
                                            onClick={nextStep}
                                            disabled={currentStep === simulationSteps.length - 1}
                                            className="bg-indigo-600 text-white py-1 px-3 rounded text-xs hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            Próximo →
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {(() => {
                                        const allSlots = [];
                                        let slotNumber = 1;

                                        Object.entries(currentStepData.state).forEach(([code, data]) => {
                                            // Separar vagas preenchidas e vazias
                                            const vagasPreenchidas = data.vagasIndividuais.filter(v => v.preenchida);
                                            const vagasVazias = data.vagasIndividuais.filter(v => !v.preenchida);

                                            // Ordenar vagas preenchidas por nota do estudante (maior nota primeiro)
                                            vagasPreenchidas.sort((a, b) => {
                                                const estudanteA = data.classificados.find(c => c.name === a.estudante);
                                                const estudanteB = data.classificados.find(c => c.name === b.estudante);

                                                if (!estudanteA || !estudanteB) return 0;

                                                // Primeiro por nota (maior primeiro)
                                                if (estudanteB.nota !== estudanteA.nota) {
                                                    return estudanteB.nota - estudanteA.nota;
                                                }

                                                // Desempate por data de nascimento (mais velho primeiro)
                                                const parseDate = (dateStr) => {
                                                    const [day, month, year] = dateStr.split('/');
                                                    return new Date(year, month - 1, day);
                                                };
                                                return parseDate(estudanteA.dataNascimento) - parseDate(estudanteB.dataNascimento);
                                            });

                                            // Adicionar vagas preenchidas ordenadas
                                            vagasPreenchidas.forEach(vaga => {
                                                allSlots.push({
                                                    number: slotNumber++,
                                                    quota: code,
                                                    student: vaga.estudante,
                                                    filled: vaga.preenchida,
                                                    received: vaga.recebidaDe !== null,
                                                    receivedFrom: vaga.recebidaDe
                                                });
                                            });

                                            // Adicionar vagas vazias (manter ordem original)
                                            vagasVazias.forEach(vaga => {
                                                allSlots.push({
                                                    number: slotNumber++,
                                                    quota: code,
                                                    student: vaga.estudante,
                                                    filled: vaga.preenchida,
                                                    received: vaga.recebidaDe !== null,
                                                    receivedFrom: vaga.recebidaDe
                                                });
                                            });
                                        });

                                        return allSlots.map(slot => (
                                            <div
                                                key={slot.number}
                                                className={`border-2 rounded p-2 transition-all text-xs ${slot.received && slot.filled
                                                    ? 'bg-orange-100 border-orange-500'
                                                    : slot.received && !slot.filled
                                                        ? 'bg-orange-50 border-orange-300 border-dashed'
                                                        : slot.filled
                                                            ? 'bg-green-50 border-green-500'
                                                            : 'bg-white border-gray-300 border-dashed'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="text-xs font-semibold text-indigo-600">
                                                        {slot.quota}
                                                        {slot.received && (
                                                            <span className="text-orange-600 italic ml-1">← {slot.receivedFrom}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs font-bold text-gray-500">#{slot.number}</div>
                                                </div>
                                                {slot.filled ? (
                                                    <div className="text-xs font-medium text-gray-800">{slot.student}</div>
                                                ) : (
                                                    <div className="text-xs text-gray-400 italic">Vazia</div>
                                                )}
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>

                            {finalResult && currentStep === simulationSteps.length - 1 && (
                                <div className="bg-white rounded-lg shadow-lg p-4">
                                    <h2 className="text-xl font-bold text-gray-800 mb-3">Resultado Final</h2>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(finalResult).map(([code, data]) => (
                                            <div key={code} className="border-2 rounded-lg p-3 bg-gradient-to-br from-gray-50 to-gray-100">
                                                <div className="font-bold text-sm text-indigo-600 mb-2">{code}</div>
                                                <div className="space-y-1 text-xs">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Vagas Orig:</span>
                                                        <span className="font-semibold">{data.vagasOriginais}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Classificados:</span>
                                                        <span className="font-semibold text-green-600">{data.classificados}</span>
                                                    </div>
                                                    {data.alunos.length > 0 && (
                                                        <div className="mt-2 pt-2 border-t">
                                                            <div className="text-xs font-semibold text-gray-600 mb-1">Aprovados:</div>
                                                            {data.alunos.map((nome, i) => (
                                                                <div key={i} className="text-xs text-gray-700 flex items-center gap-1">
                                                                    <ChevronRight className="w-3 h-3" />
                                                                    {nome}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-48 lg:w-56 bg-white rounded-lg shadow-lg p-4 max-h-screen overflow-y-auto">
                            <div className="space-y-2">
                                {Object.entries(currentStepData.state).map(([code, data]) => {
                                    const vagasRecebidas = (currentStepData.vagasRecebidas[code] || []).length;
                                    const vagasPerdidas = data.vagasOriginais - data.vagasAtivas;

                                    // Calcular total de candidatos nessa cota
                                    const totalCandidatos = data.aguardando.length;

                                    // Calcular candidatos restantes (não classificados OU classificados em cota pior)
                                    const cotaAtualPriority = quotas.find(q => q.code === code)?.priority || 999;

                                    const candidatosRestantes = data.aguardando.filter(candidato => {
                                        // Se não está classificado, conta como restante
                                        if (!currentStepData.classificadosGlobal.has(candidato.id)) {
                                            return true;
                                        }

                                        // Se está classificado, verifica em qual cota
                                        for (const [quotaCode, quotaData] of Object.entries(currentStepData.state)) {
                                            if (quotaData.classificados.some(c => c.id === candidato.id)) {
                                                const cotaClassificadaPriority = quotas.find(q => q.code === quotaCode)?.priority || 999;
                                                // Só conta como "eliminado" se a cota classificada é MELHOR OU IGUAL
                                                // Se a cota classificada é PIOR, ainda conta como restante
                                                return cotaClassificadaPriority > cotaAtualPriority;
                                            }
                                        }

                                        return false;
                                    }).length;

                                    // Verificar se é a cota ativa no passo atual
                                    const isActive = currentStepData.quota === code ||
                                        currentStepData.from === code ||
                                        currentStepData.to === code;

                                    return (
                                        <div key={code} className={`border rounded p-2 transition-all ${isActive
                                            ? 'bg-yellow-100 border-yellow-400 shadow-md'
                                            : 'bg-gray-50 border-gray-200'
                                            }`}>
                                            <div className="font-bold text-indigo-600 mb-1 text-xs">
                                                {code}
                                                {vagasRecebidas > 0 && (
                                                    <span className="text-green-600 ml-1">+{vagasRecebidas}</span>
                                                )}
                                                {vagasPerdidas > 0 && (
                                                    <span className="text-red-600 ml-1">-{vagasPerdidas}</span>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="text-xs space-y-0.5 flex-1">
                                                    <div>Ativas: <span className="font-semibold">{data.vagasAtivas}</span></div>
                                                    <div>Classif: <span className="font-semibold">{data.classificados.length}</span></div>
                                                </div>
                                                <div className="text-xs space-y-0.5 text-right">
                                                    <div className="text-blue-600">
                                                        Total: <span className="font-semibold">{totalCandidatos}</span>
                                                    </div>
                                                    <div className={candidatosRestantes === 0 ? "text-red-600 font-bold" : "text-gray-600"}>
                                                        Rest: <span className="font-semibold">{candidatosRestantes}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DE CONFIRMAÇÃO PARA REMOVER COTA */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Remover Cota</h3>
                        <p className="text-gray-600 mb-6">
                            Tem certeza que deseja remover a cota <span className="font-bold text-indigo-600">{confirmDelete}</span>?
                            <br />
                            <span className="text-sm text-gray-500">Ela será removida do mapa de migração também.</span>
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmRemoveQuota}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotaMigrationSimulator; // Adicione isso no final do arquivo