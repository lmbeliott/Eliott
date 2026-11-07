#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>
using namespace std;

vector<int> parent, taille;

int trouver(int x) {
    int racine = x;
    while (parent[racine] != racine) racine = parent[racine];
    while (parent[x] != racine) {  // compression des chemins
        int suivant = parent[x];
        parent[x] = racine;
        x = suivant;
    }
    return racine;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    parent.resize(n + 1);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n + 1, 1);

    int composantes = n, plusGrande = 1;
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        a = trouver(a);
        b = trouver(b);
        if (a != b) {
            if (taille[a] < taille[b]) swap(a, b);
            parent[b] = a;  // la petite composante passe sous la grande
            taille[a] += taille[b];
            composantes--;
            plusGrande = max(plusGrande, taille[a]);
        }
        cout << composantes << " " << plusGrande << "\n";
    }
    return 0;
}
