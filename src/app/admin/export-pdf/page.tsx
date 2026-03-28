"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/lib/data";
import { Product } from "@/types/database";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CatalogPDF from "@/components/pdf/CatalogPDF";
import { Download } from "lucide-react";

export default function ExportPdfPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
    
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Administração</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">Exportar Catálogo em PDF</h2>
        
        <p className="text-slate-600 mb-6">
          Gere um PDF contendo todos os os itens ativos do catálogo. Cada item no PDF 
          terá um link clicável que redirecionará o cliente de volta para a respectiva 
          página do produto no site.
        </p>

        {isLoading ? (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>Carregando produtos do catálogo...</span>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="text-sm text-slate-500 mb-2">
              Total de produtos carregados: <span className="font-semibold text-slate-700">{products.length}</span>
            </div>
            
            {products.length > 0 ? (
              <PDFDownloadLink
                document={<CatalogPDF products={products} baseUrl={baseUrl} />}
                fileName="catalogo-alto-mar.pdf"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors w-fit"
              >
                {/* @ts-ignore - PDFDownloadLink children prop styling */}
                {({ blob, url, loading, error }) =>
                  loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Baixar Catálogo PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            ) : (
              <div className="text-red-500">Nenhum produto encontrado no catálogo.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
