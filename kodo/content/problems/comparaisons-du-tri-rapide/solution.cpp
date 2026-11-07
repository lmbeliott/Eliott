#include <iostream>
#include <vector>
using namespace std;

int main() {
    long long n, a, b;
    cin >> n >> a >> b;
    // pos[v] = position de la valeur v dans la liste (v de 1 à n)
    vector<long long> pos(n + 2, 0);
    for (long long i = 0; i < n; i++) {
        pos[(a * i + b) % n + 1] = i;
    }
    // pour chaque x : prochaine valeur z > x avec pos[z] < pos[x]
    vector<int> pile;
    vector<long long> suivant(n + 1, n + 1), precedent(n + 1, 0);
    for (int v = 1; v <= n; v++) {
        while (!pile.empty() && pos[pile.back()] > pos[v]) {
            suivant[pile.back()] = v;
            pile.pop_back();
        }
        pile.push_back(v);
    }
    // pour chaque y : dernière valeur w < y avec pos[w] < pos[y]
    pile.clear();
    for (int v = n; v >= 1; v--) {
        while (!pile.empty() && pos[pile.back()] > pos[v]) {
            precedent[pile.back()] = v;
            pile.pop_back();
        }
        pile.push_back(v);
    }
    long long total = 0;
    for (int v = 1; v <= n; v++) {
        total += (suivant[v] - v - 1) + (v - precedent[v] - 1);
    }
    cout << total << "\n";
    return 0;
}
