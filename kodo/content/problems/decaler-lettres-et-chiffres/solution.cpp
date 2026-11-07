#include <iostream>
#include <string>
using namespace std;

int main() {
    long long k;
    cin >> k;
    string texte;
    getline(cin, texte);   // fin de la première ligne
    getline(cin, texte);

    // ramener les décalages entre 0 et 25 (et entre 0 et 9), même si k < 0
    int k26 = ((k % 26) + 26) % 26;
    int k10 = ((k % 10) + 10) % 10;

    for (int i = 0; i < (int) texte.size(); i++) {
        char c = texte[i];
        if (c >= 'a' && c <= 'z') {
            texte[i] = 'a' + (c - 'a' + k26) % 26;
        } else if (c >= 'A' && c <= 'Z') {
            texte[i] = 'A' + (c - 'A' + k26) % 26;
        } else if (c >= '0' && c <= '9') {
            texte[i] = '0' + (c - '0' + k10) % 10;
        }
    }
    cout << texte << "\n";
    return 0;
}
