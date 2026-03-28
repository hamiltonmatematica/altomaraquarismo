"use client";

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Image,
} from '@react-pdf/renderer';
import { Product } from '@/types/database';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1e40af', // Blue-800
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
  },
  colImage: { width: '15%' },
  colCode: { width: '15%' },
  colName: { width: '40%' },
  colCategory: { width: '15%' },
  colLink: { width: '15%' },
  text: {
    fontSize: 10,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  image: {
    width: 40,
    height: 40,
    objectFit: 'contain',
    marginLeft: 4,
  },
  link: {
    fontSize: 10,
    color: '#2563eb', // Blue-600
    textDecoration: 'underline',
    paddingHorizontal: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
  }
});

interface CatalogPDFProps {
  products: Product[];
  baseUrl: string;
}

const CatalogPDF: React.FC<CatalogPDFProps> = ({ products, baseUrl }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Catálogo de Produtos - Alto Mar Aquarismo</Text>

      <View style={styles.table}>
        {/* Cabeçalho */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.colImage}>
            <Text style={styles.headerText}>Imagem</Text>
          </View>
          <View style={styles.colCode}>
            <Text style={styles.headerText}>Código</Text>
          </View>
          <View style={styles.colName}>
            <Text style={styles.headerText}>Nome</Text>
          </View>
          <View style={styles.colCategory}>
            <Text style={styles.headerText}>Categoria</Text>
          </View>
          <View style={styles.colLink}>
            <Text style={styles.headerText}>Acesso</Text>
          </View>
        </View>

        {/* Linhas */}
        {products.map((product) => {
          const mainImage = product.images?.find(img => img.is_main)?.url || product.images?.[0]?.url;
          const productUrl = `${baseUrl}/produto/${product.slug}`;

          return (
            <View key={product.id} style={styles.tableRow}>
              <View style={styles.colImage}>
                {mainImage ? (
                  <Image src={mainImage} style={styles.image} />
                ) : (
                  <Text style={styles.text}>Sem imag.</Text>
                )}
              </View>
              <View style={styles.colCode}>
                <Text style={styles.text}>{product.code || '-'}</Text>
              </View>
              <View style={styles.colName}>
                <Text style={styles.text}>{product.name}</Text>
              </View>
              <View style={styles.colCategory}>
                <Text style={styles.text}>{product.category?.name || '-'}</Text>
              </View>
              <View style={styles.colLink}>
                <Link src={productUrl} style={styles.link}>
                  Ver no Site
                </Link>
              </View>
            </View>
          );
        })}
      </View>

      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) =>
          `Página ${pageNumber} de ${totalPages} - Gerado em ${new Date().toLocaleDateString('pt-BR')}`
        }
        fixed
      />
    </Page>
  </Document>
);

export default CatalogPDF;
