import { Category, Product, ProductImage } from '@/types/database';

// Dados mock para funcionar sem Supabase - Alto Mar Aquarismo
// Referência: catálogo de corais e peixes marinhos

export const MOCK_CATEGORIES: Category[] = [
    { id: '1', name: 'Corais Moles', slug: 'corais-moles', icon: 'spa', sort_order: 0, active: true, created_at: new Date().toISOString() },
    { id: '2', name: 'Corais Duros (LPS)', slug: 'corais-lps', icon: 'diamond', sort_order: 1, active: true, created_at: new Date().toISOString() },
    { id: '3', name: 'Corais Duros (SPS)', slug: 'corais-sps', icon: 'hexagon', sort_order: 2, active: true, created_at: new Date().toISOString() },
    { id: '4', name: 'Peixes Marinhos', slug: 'peixes-marinhos', icon: 'phishing', sort_order: 3, active: true, created_at: new Date().toISOString() },
    { id: '5', name: 'Invertebrados', slug: 'invertebrados', icon: 'bug_report', sort_order: 4, active: true, created_at: new Date().toISOString() },
    { id: '6', name: 'Equipamentos', slug: 'equipamentos', icon: 'settings', sort_order: 5, active: true, created_at: new Date().toISOString() },
];

export const MOCK_IMAGES: ProductImage[] = [
    { id: 'img1a', product_id: '1', url: '/products/zoanthus.png', sort_order: 0, is_main: true },
    { id: 'img2a', product_id: '2', url: '/products/acanthastrea.png', sort_order: 0, is_main: true },
    { id: 'img3a', product_id: '3', url: '/products/acropora.png', sort_order: 0, is_main: true },
    { id: 'img4a', product_id: '4', url: '/products/palhaco.png', sort_order: 0, is_main: true },
    { id: 'img5a', product_id: '5', url: '/products/camarao.png', sort_order: 0, is_main: true },
    { id: 'img6a', product_id: '6', url: '/products/skimmer.png', sort_order: 0, is_main: true },
    { id: 'img7a', product_id: '7', url: '/products/hammer.png', sort_order: 0, is_main: true },
    { id: 'img8a', product_id: '8', url: '/products/tang.png', sort_order: 0, is_main: true },
];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1', name: 'Zoanthus Dragon Eyes', slug: 'zoanthus-dragon-eyes', code: 'ZOA-001',
        description: 'Zoanthus Dragon Eyes com coloração vibrante em tons de verde e laranja. Coral de fácil manutenção, ideal para iniciantes. Cresce bem em iluminação moderada a alta. Frag com 3-5 pólipos.',
        price: 89.90, min_quantity: 1, category_id: '1', status: 'active', featured: true, tag: 'Popular',
        production_time: 'Pronta Entrega', click_count: 67, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: undefined,
        images: [MOCK_IMAGES[0]],
    },
    {
        id: '2', name: 'Acanthastrea Lord', slug: 'acanthastrea-lord', code: 'LPS-010',
        description: 'Acanthastrea Lord com padrão multicolor impressionante. Coral LPS de crescimento moderado, prefere iluminação média e fluxo moderado. Frag com 2-3 cabeças.',
        price: 159.90, min_quantity: 1, category_id: '2', status: 'active', featured: true, tag: 'Raro',
        production_time: 'Pronta Entrega', click_count: 45, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: undefined,
        images: [MOCK_IMAGES[1]],
    },
    {
        id: '3', name: 'Acropora Millepora', slug: 'acropora-millepora', code: 'SPS-005',
        description: 'Acropora Millepora com coloração azul/roxa intensa. Coral SPS de crescimento rápido, requer iluminação alta, fluxo forte e parâmetros estáveis. Para aquaristas experientes.',
        price: 199.90, min_quantity: 1, category_id: '3', status: 'active', featured: true, tag: 'Premium',
        production_time: 'Pronta Entrega', click_count: 38, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: undefined,
        images: [MOCK_IMAGES[2]],
    },
    {
        id: '4', name: 'Peixe Palhaço Ocellaris', slug: 'peixe-palhaco-ocellaris', code: 'PEI-001',
        description: 'Amphiprion Ocellaris, o famoso peixe-palhaço! Espécie resistente e de fácil manutenção. Ótima convivência com corais. Aceita alimentação variada. Tamanho: 3-4cm.',
        price: 49.90, min_quantity: 1, category_id: '4', status: 'active', featured: true, tag: 'Bestseller',
        production_time: 'Pronta Entrega', click_count: 120, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: undefined,
        images: [MOCK_IMAGES[3]],
    },
    {
        id: '5', name: 'Camarão Limpador Lysmata', slug: 'camarao-limpador-lysmata', code: 'INV-003',
        description: 'Lysmata amboinensis, camarão limpador. Remove parasitas dos peixes e restos de alimento. Essencial para manutenção do aquário. Espécie pacífica e resistente.',
        price: 79.90, min_quantity: 1, category_id: '5', status: 'active', featured: true, tag: null,
        production_time: 'Pronta Entrega', click_count: 33, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: undefined,
        images: [MOCK_IMAGES[4]],
    },
    {
        id: '6', name: 'Skimmer Reef Octopus 150', slug: 'skimmer-reef-octopus-150', code: 'EQP-020',
        description: 'Skimmer Reef Octopus Classic 150-INT. Para aquários de até 600 litros. Bomba Aquatrance incluída. Remoção eficiente de proteínas. Instalação interna no sump.',
        price: 890.00, min_quantity: 1, category_id: '6', status: 'active', featured: false, tag: null,
        production_time: '3-5 dias úteis', click_count: 22, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: undefined,
        images: [MOCK_IMAGES[5]],
    },
    {
        id: '7', name: 'Coral Hammer (Euphyllia)', slug: 'coral-hammer-euphyllia', code: 'LPS-015',
        description: 'Euphyllia ancora com tentáculos em formato de martelo. Coloração green/gold. Coral LPS muito popular, fluxo moderado e iluminação média. Frag com 2 cabeças.',
        price: 129.90, min_quantity: 1, category_id: '2', status: 'active', featured: true, tag: 'Novo',
        production_time: 'Pronta Entrega', click_count: 51, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: undefined,
        images: [MOCK_IMAGES[6]],
    },
    {
        id: '8', name: 'Tang Azul (Paracanthurus)', slug: 'tang-azul-paracanthurus', code: 'PEI-008',
        description: 'Paracanthurus hepatus, a famosa "Dory". Peixe ativo e colorido. Requer aquário espaçoso (mínimo 300L). Alimentação variada com ênfase em algas. Tamanho: 5-7cm.',
        price: 189.90, min_quantity: 1, category_id: '4', status: 'active', featured: true, tag: 'Destaque',
        production_time: 'Pronta Entrega', click_count: 95, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: undefined,
        images: [MOCK_IMAGES[7]],
    },
];

// Associar categorias aos produtos
MOCK_PRODUCTS.forEach(p => {
    p.category = MOCK_CATEGORIES.find(c => c.id === p.category_id);
});
