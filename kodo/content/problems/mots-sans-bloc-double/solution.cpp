#include <iostream>
#include <string>
using namespace std;

int n;
string mot, premier;
long long compte = 0;

// le mot ne finit-il par aucun bloc doublé ? (les autres ont déjà été vérifiés)
bool fin_valable() {
    int k = mot.size();
    for (int l = 1; 2 * l <= k; l++)
        if (mot.compare(k - l, l, mot, k - 2 * l, l) == 0) return false;
    return true;
}

void prolonger() {
    if ((int)mot.size() == n) {
        if (compte == 0) premier = mot;   // les lettres sont essayées dans l'ordre : c'est le plus petit
        compte++;
        return;
    }
    for (char lettre : string("abc")) {
        mot.push_back(lettre);
        if (fin_valable()) prolonger();
        mot.pop_back();
    }
}

int main() {
    string prefixe;
    cin >> n >> prefixe;
    bool valable = true;
    for (char lettre : prefixe) {
        mot.push_back(lettre);
        if (!fin_valable()) valable = false;
    }
    if (valable) prolonger();
    cout << compte << "\n";
    if (compte > 0) cout << premier << "\n";
    return 0;
}
