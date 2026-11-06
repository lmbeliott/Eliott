#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// temps est trié : renvoie le nombre de temps strictement inférieurs à t,
// c'est-à-dire le premier indice i tel que temps[i] >= t
int nb_plus_rapides(const vector<int>& temps, int t) {
    int gauche = 0, droite = temps.size();
    while (gauche < droite) {
        int milieu = (gauche + droite) / 2;
        if (temps[milieu] < t) gauche = milieu + 1;
        else droite = milieu;
    }
    return gauche;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<int> temps(n);
    for (int i = 0; i < n; i++) cin >> temps[i];
    sort(temps.begin(), temps.end());
    for (int k = 0; k < q; k++) {
        int t;
        cin >> t;
        int avant = nb_plus_rapides(temps, t);
        // les temps sont entiers : « <= t » revient à « < t + 1 »
        int ex_aequo = nb_plus_rapides(temps, t + 1) - avant;
        cout << avant + 1 << " " << ex_aequo << "\n";
    }
    return 0;
}
