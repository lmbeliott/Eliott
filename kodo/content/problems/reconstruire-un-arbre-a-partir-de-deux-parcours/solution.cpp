#include <iostream>
#include <vector>
using namespace std;

int n;
vector<int> prefixe, infixe, position, suffixe;
bool possible = true;

// sous-arbre : prefixe[p .. p+taille-1] et infixe[i .. i+taille-1]
void construire(int p, int i, int taille) {
    if (taille == 0 || !possible) return;
    int racine = prefixe[p];
    int k = position[racine];
    if (!(i <= k && k < i + taille)) {
        possible = false;
        return;
    }
    int g = k - i;                // taille du sous-arbre gauche
    construire(p + 1, i, g);
    construire(p + 1 + g, k + 1, taille - 1 - g);
    suffixe.push_back(racine);
}

int main() {
    cin >> n;
    prefixe.resize(n);
    infixe.resize(n);
    position.resize(n + 1);
    for (int k = 0; k < n; k++) cin >> prefixe[k];
    for (int k = 0; k < n; k++) {
        cin >> infixe[k];
        position[infixe[k]] = k;  // position de chaque nœud dans l'ordre infixe
    }
    construire(0, 0, n);
    if (!possible) {
        cout << "IMPOSSIBLE\n";
    } else {
        for (int k = 0; k < n; k++) cout << suffixe[k] << (k + 1 == n ? "\n" : " ");
    }
    return 0;
}
