#include <iostream>
#include <string>
#include <vector>
using namespace std;

// les quatre formes de trimino en L, décrites depuis leur première case
// (la plus haute, puis la plus à gauche) : (décalage de ligne, décalage de colonne)
const int FORMES[4][3][2] = {
    {{0, 0}, {0, 1}, {1, 0}},
    {{0, 0}, {0, 1}, {1, 1}},
    {{0, 0}, {1, 0}, {1, 1}},
    {{0, 0}, {1, 0}, {1, -1}},
};

int r, c;
vector<vector<bool>> couverte;

// nombre de façons de finir le pavage, sachant que les cases avant pos sont couvertes
long long compter(int pos) {
    while (pos < r * c && couverte[pos / c][pos % c]) pos++;
    if (pos == r * c) return 1;            // tout est couvert : un pavage
    int lig = pos / c, col = pos % c;
    long long total = 0;
    for (int f = 0; f < 4; f++) {
        bool tient = true;
        for (int i = 0; i < 3; i++) {
            int l = lig + FORMES[f][i][0], k = col + FORMES[f][i][1];
            if (l < 0 || l >= r || k < 0 || k >= c || couverte[l][k]) tient = false;
        }
        if (!tient) continue;
        for (int i = 0; i < 3; i++) couverte[lig + FORMES[f][i][0]][col + FORMES[f][i][1]] = true;
        total += compter(pos + 1);
        for (int i = 0; i < 3; i++) couverte[lig + FORMES[f][i][0]][col + FORMES[f][i][1]] = false;
    }
    return total;
}

int main() {
    cin >> r >> c;
    couverte.assign(r, vector<bool>(c, false));
    int libres = 0;
    for (int i = 0; i < r; i++) {
        string ligne;
        cin >> ligne;
        for (int j = 0; j < c; j++) {
            couverte[i][j] = (ligne[j] == '#');
            if (!couverte[i][j]) libres++;
        }
    }
    if (libres % 3 != 0) {
        cout << 0 << "\n";
        return 0;
    }
    cout << compter(0) << "\n";
    return 0;
}
