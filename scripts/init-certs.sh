#!/bin/bash

# Script to generate self-signed SSL/TLS certificates for local development
# Creates the frontend/certs directory and generates cert.pem and key.pem
# Run this script once before starting the application

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CERT_DIR="$PROJECT_ROOT/frontend/certs"

echo "Generating self-signed SSL/TLS certificates for local development..."

# Check if openssl is available
if ! command -v openssl &> /dev/null; then
    echo "Error: openssl is not installed. Please install openssl first."
    echo "  macOS: brew install openssl"
    echo "  Ubuntu/Debian: sudo apt-get install openssl"
    exit 1
fi

# Create certs directory if it doesn't exist
if [ ! -d "$CERT_DIR" ]; then
    echo "Creating directory: $CERT_DIR"
    mkdir -p "$CERT_DIR"
fi

# Generate private key
echo "Generating private key..."
openssl genrsa -out "$CERT_DIR/key.pem" 2048 2>/dev/null

# Generate self-signed certificate (valid for 365 days)
echo "Generating self-signed certificate..."
openssl req -new -x509 -key "$CERT_DIR/key.pem" -out "$CERT_DIR/cert.pem" -days 365 \
    -subj "/C=FR/ST=IDF/L=Paris/O=Neo4Flix/CN=localhost" 2>/dev/null

if [ -f "$CERT_DIR/cert.pem" ] && [ -f "$CERT_DIR/key.pem" ]; then
    echo ""
    echo "✓ Certificates generated successfully!"
    echo "  Location: $CERT_DIR"
    echo "  - Certificate: cert.pem"
    echo "  - Private key: key.pem"
    echo ""
    echo "Certificate details:"
    openssl x509 -in "$CERT_DIR/cert.pem" -text -noout 2>/dev/null | grep -E "Subject:|Not Before|Not After|Public-Key"
    echo ""
    echo "Note: These are self-signed certificates for local development only."
    echo "Your browser will show a security warning - this is normal and expected."
else
    echo "✗ Error generating certificates!"
    exit 1
fi

