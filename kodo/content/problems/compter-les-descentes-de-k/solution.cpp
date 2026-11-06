#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    string symboles;
    cin >> n >> k >> symboles;

    // vues[h + n] = nombre de points déjà rencontrés à la hauteur h (h entre -n et n)
    vector<long long> vues(2 * n + 1, 0);
    int hauteur = 0;
    long long total = 0;
    for (int j = 0; j <= n; j++) {
        if (j > 0) {
            char pas = symboles[j - 1];
            if (pas == '+') hauteur++;
            else if (pas == '-') hauteur--;
        }
        // départs possibles : les points précédents situés K plus haut
        int depart = hauteur + k;
        if (depart <= n) total += vues[depart + n];
        vues[hauteur + n]++;
    }
    cout << total << "\n";
    return 0;
}
