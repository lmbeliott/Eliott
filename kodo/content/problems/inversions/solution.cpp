#include <iostream>
#include <vector>
using namespace std;

int n;
vector<int> arbre;  // arbre de Fenwick sur les valeurs : compte les valeurs déjà vues

int somme(int i) {  // nombre de valeurs déjà vues parmi 1..i
    int s = 0;
    for (; i > 0; i -= i & -i) s += arbre[i];
    return s;
}

void ajoute(int i) {  // la valeur i vient d'être vue
    for (; i <= n; i += i & -i) arbre[i] += 1;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n;
    arbre.assign(n + 1, 0);
    long long total = 0;
    for (int i = 0; i < n; i++) {
        int d;
        cin >> d;
        // i valeurs sont déjà vues ; celles qui sont > d forment une inversion avec d.
        total += i - somme(d);
        ajoute(d);
    }
    cout << total << "\n";
    return 0;
}
