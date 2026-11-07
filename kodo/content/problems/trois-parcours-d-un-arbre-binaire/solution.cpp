#include <iostream>
#include <vector>
using namespace std;

vector<int> gauche, droite, prefixe, infixe, suffixe;

void parcourir(int v) {
    if (v == 0) return;
    prefixe.push_back(v);       // avant les fils
    parcourir(gauche[v]);
    infixe.push_back(v);        // entre les deux fils
    parcourir(droite[v]);
    suffixe.push_back(v);       // après les fils
}

void afficher(const vector<int> &t) {
    for (int i = 0; i < (int)t.size(); i++) cout << t[i] << (i + 1 == (int)t.size() ? "\n" : " ");
}

int main() {
    int n;
    cin >> n;
    gauche.assign(n + 1, 0);
    droite.assign(n + 1, 0);
    vector<bool> est_fils(n + 1, false);
    for (int i = 1; i <= n; i++) {
        cin >> gauche[i] >> droite[i];
        est_fils[gauche[i]] = true;
        est_fils[droite[i]] = true;
    }
    int racine = 1;
    while (est_fils[racine]) racine++;
    parcourir(racine);
    afficher(prefixe);
    afficher(infixe);
    afficher(suffixe);
    return 0;
}
