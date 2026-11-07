#include <iostream>
#include <string>
#include <vector>
using namespace std;

int k;

// ligne (à partir de 0) sur laquelle tombe la lettre d'indice i
int ligne(int i) {
    if (k == 1) {
        return 0;
    }
    int periode = 2 * k - 2;
    int r = i % periode;
    if (r < k) {
        return r;          // on descend
    }
    return periode - r;    // on remonte
}

int main() {
    long long kLu;
    string chiffre;
    cin >> kLu >> chiffre;
    int n = chiffre.size();
    k = (int) min(kLu, (long long) n);   // les lignes au-delà de la n-ième restent vides

    // premier passage : nombre de lettres sur chaque ligne
    vector<int> longueur(k, 0);
    for (int i = 0; i < n; i++) {
        longueur[ligne(i)]++;
    }

    // début de chaque ligne dans le message chiffré
    vector<int> debut(k, 0);
    for (int r = 1; r < k; r++) {
        debut[r] = debut[r - 1] + longueur[r - 1];
    }

    // second passage : chaque indice prend la prochaine lettre de sa ligne
    string message(n, ' ');
    for (int i = 0; i < n; i++) {
        int r = ligne(i);
        message[i] = chiffre[debut[r]];
        debut[r]++;
    }
    cout << message << "\n";
    return 0;
}
